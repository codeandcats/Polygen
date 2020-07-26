// Ben you're having performance issues. Maybe commit what you've got then try some different things like:

// - Precomputing the polygon centres and storing in model...maybe
// - Turning point objects into number tuples, given two libraries I use do this I'd be
//   really curious to see how much of an impact it makes
// - Different clipping method for polygons? Maybe using an encompassing triangle? Or a polygon
//   that wraps around the triangle very closely?
// - Batch similar calls like:
//   - Background tiles could be a bunch of paths with one fill at the end
//   - Points, draw selected in one batch, non-selected in another
//   - Polygon edges
// - Draw scaled image once in off-screen working canvas?...Hmm could be tricky,
//   would need to cache based on a few variables, like image dimensions, zoom, etc
// - Round points

import circumcenter = require('circumcenter');
import { EditorMode } from '../../shared/models/editorMode';
import { LayerPixelData } from '../../shared/models/layerImagePixelData';
import { Point } from '../../shared/models/point';
import { PolygenDocument } from '../../shared/models/polygenDocument';
import { Polygon } from '../../shared/models/polygon';
import { Rectangle } from '../../shared/models/rectangle';
import { Rgba } from '../../shared/models/rgba';
import { Size } from '../../shared/models/size';
import { ViewPort } from '../../shared/models/viewPort';
import {
  forEachPointWithinPolygon,
  getCenter,
  getDistanceBetweenPoints,
  isPointInRectangle,
  trianglePointsToTriangleArrayPoints,
} from '../../shared/utils/geometry';
import { clamp } from '../../shared/utils/math';
import { ImageCache } from '../models/imageCache';
import { Tool, ToolHelper } from '../models/tools/common';
import { Layer } from '../../shared/models/layer';

export type RenderMode = EditorMode | 'final';

const EDGE_STROKE_COLOR = '#eee';
const EDGE_FILL_COLOR = '#333';
const POINT_FILL_COLOR = EDGE_FILL_COLOR;
const POINT_STROKE_COLOR = EDGE_STROKE_COLOR;

export function applyViewportTransform(
  context: CanvasRenderingContext2D,
  bounds: Rectangle,
  viewPort: ViewPort,
  pixelRatio: number
) {
  context.translate(
    bounds.width / 2 + viewPort.pan.x * pixelRatio,
    bounds.height / 2 + viewPort.pan.y * pixelRatio
  );

  context.scale(pixelRatio, pixelRatio);

  const zoom = viewPort.zoom;
  context.scale(zoom, zoom);
}

interface GradientColorStep {
  stop: number;
  fillStyle: string;
}

function createGradient(
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  colorStops: GradientColorStep[]
) {
  const gradient = context.createLinearGradient(x1, y1, x2, y2);
  for (const colorStop of colorStops) {
    gradient.addColorStop(colorStop.stop, colorStop.fillStyle);
  }
  return gradient;
}

export function getImageBounds(
  documentDimensions: Size,
  layer: Layer
): Rectangle {
  const halfWidth = documentDimensions.width / 2;
  const halfHeight = documentDimensions.height / 2;
  const x1 = halfWidth * layer.image.topLeft.x;
  const y1 = halfHeight * layer.image.topLeft.y;
  const x2 = halfWidth * layer.image.bottomRight.x;
  const y2 = halfHeight * layer.image.bottomRight.y;
  const width = x2 - x1;
  const height = y2 - y1;
  return {
    x: x1,
    y: y1,
    width,
    height,
  };
}

export function getAbsoluteDocumentPoint(
  relativeDocumentPoint: Point,
  documentDimensions: Size,
  shouldRound: boolean = false
): Point {
  const result = {
    x: relativeDocumentPoint.x * (documentDimensions.width / 2),
    y: relativeDocumentPoint.y * (documentDimensions.height / 2),
  };

  if (shouldRound) {
    result.x = Math.round(result.x);
    result.y = Math.round(result.y);
  }

  return result;
}

export function getLayerPixelData(
  document: PolygenDocument,
  layer: Layer,
  imageCache: ImageCache
): LayerPixelData {
  const { width, height } = document.dimensions;
  const canvas = window.document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Could not get context for canvas');
  }

  const image = getCachedImageForLayer(document, layer, imageCache);

  if (!image) {
    return {
      data: new Uint8ClampedArray(
        4 * document.dimensions.width * document.dimensions.height
      ),
      width,
      height,
    };
  }

  const center = getCenter(document.dimensions);

  context.translate(center.x, center.y);

  const imageBounds = getImageBounds(document.dimensions, layer);

  context.drawImage(
    image.element,
    imageBounds.x,
    imageBounds.y,
    imageBounds.width,
    imageBounds.height
  );

  const imageData = context.getImageData(
    0,
    0,
    document.dimensions.width,
    document.dimensions.height
  );

  return {
    data: imageData.data,
    width,
    height,
  };
}

export function getPolygonAverageColor(
  pixelData: LayerPixelData,
  polygon: [Point, Point, Point]
): Rgba {
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let totalA = 0;
  let pixelCount = 0;

  const layerBounds = {
    x: 0,
    y: 0,
    width: pixelData.width,
    height: pixelData.height,
  };

  const BYTES_PER_PIXEL = 4;
  const bytesPerRow = pixelData.width * BYTES_PER_PIXEL;

  forEachPointWithinPolygon(polygon, (point) => {
    if (!isPointInRectangle(point, layerBounds)) {
      return;
    }

    const pixelIndex = point.y * bytesPerRow + BYTES_PER_PIXEL * point.x;

    const currentR = clamp(0, 255, pixelData.data[pixelIndex]);
    const currentG = clamp(0, 255, pixelData.data[pixelIndex + 1]);
    const currentB = clamp(0, 255, pixelData.data[pixelIndex + 2]);
    const currentA = clamp(0, 255, pixelData.data[pixelIndex + 3]);

    totalR += currentR;
    totalG += currentG;
    totalB += currentB;
    totalA += currentA;

    pixelCount++;
  });

  const r =
    pixelCount === 0 ? 0 : clamp(0, 255, Math.round(totalR / pixelCount));
  const g =
    pixelCount === 0 ? 0 : clamp(0, 255, Math.round(totalG / pixelCount));
  const b =
    pixelCount === 0 ? 0 : clamp(0, 255, Math.round(totalB / pixelCount));
  let a = pixelCount === 0 ? 0 : clamp(0, 255, Math.round(totalA / pixelCount));

  a = +clamp(0, 1, a / 255).toFixed(2);

  return {
    r,
    g,
    b,
    a,
  };
}

interface RecalculatePolygonColoursOptions {
  document: PolygenDocument;
  imageCache: ImageCache;
  layer: Layer;
  points?: Point[];
  polygons?: Polygon[];
}

export function recalculatePolygonColours(
  options: RecalculatePolygonColoursOptions
): Polygon[] {
  const { document, imageCache, layer } = options;
  let polygons = options.polygons || options.layer.polygons;
  const points = options.points || options.layer.points;

  const image = getCachedImageForLayer(document, layer, imageCache);

  if (!image) {
    return polygons.map((polygon) => {
      return {
        ...polygon,
        color: {
          r: 0,
          g: 0,
          b: 0,
          a: 0,
        },
      };
    });
  }

  if (!image.hasElementLoaded) {
    return layer.polygons;
  }

  const layerPixelData = getLayerPixelData(document, layer, imageCache);

  polygons = polygons.map((polygon) => {
    const polygonPoints = polygon.pointIndices.map((index) => {
      let point = (points as Point[])[index];
      point = getAbsoluteDocumentPoint(point, document.dimensions);
      point = {
        x: point.x + document.dimensions.width / 2,
        y: point.y + document.dimensions.height / 2,
      };
      return point;
    }) as [Point, Point, Point];

    const color = getPolygonAverageColor(layerPixelData, polygonPoints);

    if (
      layer.transparencyThreshold != null &&
      color.a < layer.transparencyThreshold
    ) {
      color.a = 0;
    } else if (
      layer.opacityThreshold != null &&
      color.a >= layer.opacityThreshold
    ) {
      color.a = 1;
    }

    return {
      ...polygon,
      color,
    };
  });

  return polygons;
}

export interface RenderDocumentOptions {
  bounds: Rectangle;
  context: CanvasRenderingContext2D;
  document: PolygenDocument;
  imageCache: ImageCache;
  mode: RenderMode;
  pixelRatio: number;
  selectedLayerIndex: number;
  selectedPointIndices: number[];
  shouldRenderPoints: boolean;
  shouldRenderEdges: boolean;
  viewPort: ViewPort;
}

export function renderDocument(options: RenderDocumentOptions) {
  const {
    bounds,
    context,
    document,
    imageCache,
    mode,
    pixelRatio,
    selectedPointIndices,
    viewPort,
  } = options;
  const documentDimensions = document.dimensions;

  runInTransaction(options.context, () => {
    applyViewportTransform(context, bounds, viewPort, pixelRatio);

    renderDocumentBackground({
      context: options.context,
      document: options.document,
      mode: options.mode,
    });

    if (mode !== 'edit') {
      context.rect(
        bounds.x - bounds.width / 2,
        bounds.y - bounds.height / 2,
        bounds.width,
        bounds.height
      );
      context.clip();
    }

    for (
      let layerIndex = 0;
      layerIndex < options.document.layers.length;
      layerIndex++
    ) {
      const layer = options.document.layers[layerIndex];
      const isSelectedLayer = layerIndex === options.selectedLayerIndex;
      if (layer.isVisible) {
        renderLayer({
          ...options,
          mode,
          isSelectedLayer,
          layer,
        });
      }
    }
  });
}

export interface RenderLayerOptions extends RenderDocumentOptions {
  mode: RenderMode;
  isSelectedLayer: boolean;
  layer: Layer;
}

function renderLayer(options: RenderLayerOptions) {
  const {
    context,
    document,
    imageCache,
    isSelectedLayer,
    layer,
    mode,
    selectedPointIndices,
    shouldRenderEdges,
  } = options;
  const documentDimensions = document.dimensions;
  const zoom = options.viewPort.zoom;

  runInTransaction(context, () => {
    if (mode === 'edit' && isSelectedLayer && layer.image.imageId) {
      const imageSource = document.images.find(
        (image) => image.id === layer.image.imageId
      );
      if (imageSource) {
        const image = imageCache.getImage(imageSource);
        if (image.hasElementLoaded) {
          const bounds = getImageBounds(documentDimensions, layer);
          context.drawImage(
            image.element,
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height
          );
        }
      }
    }

    runInTransaction(context, () => {
      context.globalAlpha = mode === 'edit' ? 0.8 : 1;
      const { points } = layer;

      for (const polygon of layer.polygons) {
        // tracePolygonPath({
        // 	context,
        // 	documentDimensions,
        // 	points,
        // 	polygon
        // });
        renderPolygon({
          context,
          documentDimensions,
          points,
          polygon,
          shouldRenderEdges,
          zoom,
        });
      }
    });

    if (isSelectedLayer) {
      const selectedPointMap = selectedPointIndices.reduce((result, index) => {
        result[index] = true;
        return result;
      }, {} as { [index: number]: boolean | undefined });

      for (let pointIndex = 0; pointIndex < layer.points.length; pointIndex++) {
        const point = layer.points[pointIndex];
        const isSelected = !!selectedPointMap[pointIndex];
        renderPoint(context, point, documentDimensions, isSelected);
      }
    }
  });
}

export function renderPoint(
  context: CanvasRenderingContext2D,
  point: Point,
  documentDimensions: Size,
  isSelected: boolean
) {
  const RADIUS = 3;

  point = getAbsoluteDocumentPoint(point, documentDimensions);

  runInTransaction(context, () => {
    context.beginPath();

    context.ellipse(point.x, point.y, RADIUS, RADIUS, 0, 0, 360);

    context.lineWidth = 1;
    context.fillStyle = isSelected ? SELECTION_COLOR : POINT_FILL_COLOR;

    context.fill();

    if (isSelected) {
      renderSelectionStroke(context);
    } else {
      context.strokeStyle = POINT_STROKE_COLOR;
    }

    context.stroke();
  });
}

export interface RenderPolygonOptions {
  context: CanvasRenderingContext2D;
  documentDimensions: Size;
  points: Point[];
  polygon: Polygon;
  shouldRenderEdges: boolean;
  zoom: number;
}

export function tracePolygonPath(options: {
  context: CanvasRenderingContext2D;
  documentDimensions: Size;
  points: Point[];
  polygon: Polygon;
}) {
  const { context, documentDimensions, points, polygon } = options;

  const polygonPoints = polygon.pointIndices.map((pointIndex) => {
    return getAbsoluteDocumentPoint(points[pointIndex], documentDimensions);
  });

  context.beginPath();
  context.moveTo(polygonPoints[0].x, polygonPoints[0].y);
  context.lineTo(polygonPoints[1].x, polygonPoints[1].y);
  context.lineTo(polygonPoints[2].x, polygonPoints[2].y);
  context.closePath();
}

export function fillPolygon(options: {
  context: CanvasRenderingContext2D;
  polygon: Polygon;
  zoom: number;
}) {
  const { context, polygon, zoom } = options;
  const oldGlobalAlpha = context.globalAlpha;
  context.globalAlpha = context.globalAlpha * polygon.color.a;
  context.fillStyle = `rgb(${polygon.color.r}, ${polygon.color.g}, ${polygon.color.b})`;
  context.fill();

  // Awful workaround to fill unwanted seams between polygons
  // (is problematic with transparency)
  context.lineWidth = 0.5 / zoom;
  context.strokeStyle = context.fillStyle;
  context.stroke();

  context.globalAlpha = oldGlobalAlpha;
}

export function renderPolygon(options: RenderPolygonOptions) {
  const { context, documentDimensions, points, polygon, zoom } = options;

  runInTransaction(context, () => {
    const polygonPoints = polygon.pointIndices.map((pointIndex) => {
      return getAbsoluteDocumentPoint(points[pointIndex], documentDimensions);
    });

    const polygonPointsAsArrays = trianglePointsToTriangleArrayPoints(
      polygonPoints
    );

    const centerPoint = circumcenter(polygonPointsAsArrays);
    const clippingRadius = getDistanceBetweenPoints(
      { x: centerPoint[0], y: centerPoint[1] },
      polygonPoints[0]
    );

    context.beginPath();
    context.ellipse(
      centerPoint[0],
      centerPoint[1],
      clippingRadius,
      clippingRadius,
      0,
      0,
      360
    );
    context.clip();

    tracePolygonPath(options);

    fillPolygon(options);

    if (options.shouldRenderEdges) {
      context.lineWidth = 2;
      context.strokeStyle = EDGE_STROKE_COLOR;
      context.stroke();

      context.lineWidth = 1;
      context.strokeStyle = EDGE_FILL_COLOR;
      context.stroke();
    }
  });
}

const SELECTION_COLOR = '#337ab7';

export function renderSelectionRectangle(
  context: CanvasRenderingContext2D,
  rectangleInProjectSpace: Rectangle
) {
  runInTransaction(context, () => {
    context.beginPath();

    context.rect(
      rectangleInProjectSpace.x,
      rectangleInProjectSpace.y,
      rectangleInProjectSpace.width,
      rectangleInProjectSpace.height
    );

    context.fillStyle = SELECTION_COLOR;
    context.globalAlpha = 0.15;
    context.fill();
    context.globalAlpha = 1;

    renderSelectionStroke(context);
  });
}

export function renderSelectionStroke(context: CanvasRenderingContext2D) {
  const SELECTION_STROKE_COLOR_1 = '#fff';
  const SELECTION_STROKE_COLOR_2 = SELECTION_COLOR;

  context.lineWidth = 1;
  context.strokeStyle = SELECTION_STROKE_COLOR_1;
  context.stroke();

  const DASH_LENGTH = 5;
  const STEP_ANIMATION_DURATION = 400;

  context.lineDashOffset =
    DASH_LENGTH *
    2 *
    ((Date.now() % STEP_ANIMATION_DURATION) / STEP_ANIMATION_DURATION);
  context.setLineDash([DASH_LENGTH, DASH_LENGTH]);
  context.strokeStyle = SELECTION_STROKE_COLOR_2;
  context.stroke();
}

export function renderTool(
  context: CanvasRenderingContext2D,
  bounds: Rectangle,
  helper: ToolHelper,
  tool: Tool
) {
  runInTransaction(context, () => {
    context.beginPath();
    const editor = helper.getEditor();
    const pixelRatio = helper.getPixelRatio();
    applyViewportTransform(context, bounds, editor.viewPort, pixelRatio);
    tool.render(helper, context, bounds);
  });
}

export function renderTransparencyTiles(
  context: CanvasRenderingContext2D,
  bounds: Rectangle,
  tileSize: number = 20,
  pixelRatio: number
) {
  runInTransaction(context, () => {
    context.scale(pixelRatio, pixelRatio);
    const squareColour = ['#FFF', '#DDD'];
    for (let y = 0; y * tileSize < bounds.height; y++) {
      for (let x = 0; x * tileSize < bounds.width; x++) {
        const colourIndex = (x + y) % 2;
        context.fillStyle = squareColour[colourIndex];
        context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  });
}

export function runInTransaction(
  context: CanvasRenderingContext2D,
  callback: () => void
) {
  context.save();
  try {
    callback();
  } finally {
    context.restore();
  }
}

interface RenderDocumentBackgroundOptions {
  context: CanvasRenderingContext2D;
  document: PolygenDocument;
  mode: RenderMode;
}

export function renderDocumentBackground(
  options: RenderDocumentBackgroundOptions
) {
  const { context, document, mode } = options;

  runInTransaction(context, () => {
    context.beginPath();

    context.lineWidth = 1;
    context.strokeStyle = '#333';
    context.fillStyle = 'rgba(255, 255, 255, .6)';

    const halfWidth = document.dimensions.width / 2;
    const halfHeight = document.dimensions.height / 2;

    context.rect(
      -halfWidth,
      -halfHeight,
      document.dimensions.width,
      document.dimensions.height
    );

    context.stroke();
    context.fill();

    if (mode === 'final') {
      return;
    }

    // Draw box shadow around document
    const SHADOW_OFFSET = 5;
    const SHADOW_COLOR_STOPS: GradientColorStep[] = [
      { stop: 0, fillStyle: 'rgba(0, 0, 0, .3)' },
      { stop: 1, fillStyle: 'rgba(0, 0, 0, .0)' },
    ];

    // Right shadow
    context.beginPath();
    context.moveTo(halfWidth, -halfHeight + SHADOW_OFFSET);
    context.lineTo(halfWidth, halfHeight);
    context.lineTo(halfWidth + SHADOW_OFFSET, halfHeight + SHADOW_OFFSET);
    context.lineTo(halfWidth + SHADOW_OFFSET, -halfHeight + SHADOW_OFFSET);
    context.closePath();
    context.fillStyle = createGradient(
      context,
      halfWidth + 1,
      0,
      halfWidth + 1 + SHADOW_OFFSET,
      0,
      SHADOW_COLOR_STOPS
    );
    context.fill();

    // Bottom shadow
    context.beginPath();
    context.moveTo(-halfWidth + SHADOW_OFFSET, halfHeight);
    context.lineTo(-halfWidth + SHADOW_OFFSET, halfHeight + SHADOW_OFFSET);
    context.lineTo(halfWidth + SHADOW_OFFSET, halfHeight + SHADOW_OFFSET);
    context.lineTo(halfWidth, halfHeight);
    context.fillStyle = createGradient(
      context,
      0,
      halfHeight + 1,
      0,
      halfHeight + 1 + SHADOW_OFFSET,
      SHADOW_COLOR_STOPS
    );
    context.fill();
  });
}

export function getCachedImageForLayer(
  document: PolygenDocument,
  layer: Layer,
  cache: ImageCache
) {
  const image = document.images.find(
    (image) => image.id === layer.image.imageId
  );
  if (!image) {
    return undefined;
  }
  return cache.getImage(image);
}
