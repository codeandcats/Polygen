import { Editor } from '../../shared/models/editor';
import { Layer } from '../../shared/models/layer';
import { LayerImage } from '../../shared/models/layerImage';
import { LayerPixelData } from '../../shared/models/layerImagePixelData';
import { Point } from '../../shared/models/point';
import { PolygenDocument } from '../../shared/models/polygenDocument';
import { Polygon } from '../../shared/models/polygon';
import { Rectangle } from '../../shared/models/rectangle';
import { Rgba } from '../../shared/models/rgba';
import { Size } from '../../shared/models/size';
import { forEachPointWithinPolygon, getCenter, isPointInRectangle } from '../../shared/utils/geometry';
import { clamp } from '../../shared/utils/math';
import { ImageCache } from '../models/imageCache';
import { Tool, ToolHelper } from '../models/tools/common';

export function applyViewportTransform(
	context: CanvasRenderingContext2D,
	bounds: Rectangle,
	editor: Editor
) {
	context.translate(
		(bounds.width / 2) + editor.viewPort.pan.x,
		(bounds.height / 2) + editor.viewPort.pan.y
	);

	const zoom = editor.viewPort.zoom;
	context.scale(zoom, zoom);
}

interface GradientColorStep {
	stop: number;
	fillStyle: string;
}

function createGradient(
	context: CanvasRenderingContext2D,
	x1: number, y1: number, x2: number, y2: number,
	colorStops: GradientColorStep[]
) {
	const gradient = context.createLinearGradient(x1, y1, x2, y2);
	for (const colorStop of colorStops) {
		gradient.addColorStop(colorStop.stop, colorStop.fillStyle);
	}
	return gradient;
}

export function getImageBounds(documentDimensions: Size, layer: Layer): Rectangle {
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
		height
	};
}

export function getAbsoluteDocumentPoint(relativeDocumentPoint: Point, documentDimensions: Size): Point {
	return {
		x: relativeDocumentPoint.x * (documentDimensions.width / 2),
		y: relativeDocumentPoint.y * (documentDimensions.height / 2)
	};
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

	if (!layer.image.source) {
		return {
			data: new Uint8ClampedArray(4 * document.dimensions.width * document.dimensions.height),
			width,
			height
		};
	}

	const center = getCenter(document.dimensions);

	context.translate(center.x, center.y);

	const imageBounds = getImageBounds(document.dimensions, layer);

	const element = imageCache.getImage(layer.image.source).element;

	context.drawImage(element, imageBounds.x, imageBounds.y, imageBounds.width, imageBounds.height);

	const imageData = context.getImageData(0, 0, document.dimensions.width, document.dimensions.height);

	return {
		data: imageData.data,
		width,
		height
	};
}

export function getPolygonAverageColor(pixelData: LayerPixelData, polygon: [Point, Point, Point]): Rgba {
	let totalR = 0;
	let totalG = 0;
	let totalB = 0;
	let totalA = 0;
	let pixelCount = 0;

	const layerBounds = {
		x: 0,
		y: 0,
		width: pixelData.width,
		height: pixelData.height
	};

	const BYTES_PER_PIXEL = 4;
	const bytesPerRow = pixelData.width * BYTES_PER_PIXEL;

	forEachPointWithinPolygon(polygon, point => {
		if (!isPointInRectangle(point, layerBounds)) {
			return;
		}

		const pixelIndex = (point.y * bytesPerRow) + (BYTES_PER_PIXEL * point.x);

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

	const r = pixelCount === 0 ? 0 : clamp(0, 255, Math.round(totalR / pixelCount));
	const g = pixelCount === 0 ? 0 : clamp(0, 255, Math.round(totalG / pixelCount));
	const b = pixelCount === 0 ? 0 : clamp(0, 255, Math.round(totalB / pixelCount));
	const a = pixelCount === 0 ? 0 : clamp(0, 255, Math.round(totalA / pixelCount));

	return {
		r,
		g,
		b,
		a
	};
}

interface RecalculatePolygonColoursOptions {
	document: PolygenDocument;
	imageCache: ImageCache;
	layer: Layer;
	points?: Point[];
	polygons?: Polygon[];
}

export function recalculatePolygonColours(options: RecalculatePolygonColoursOptions): Polygon[] {
	const { document, imageCache, layer } = options;
	let polygons = options.polygons || options.layer.polygons;
	const points = options.points || options.layer.points;

	if (!layer.image.source) {
		return polygons.map(polygon => {
			return {
				...polygon,
				color: {
					r: 0,
					g: 0,
					b: 0,
					a: 0
				}
			};
		});
	}

	const image = options.imageCache.getImage(layer.image.source);
	if (!image.hasElementLoaded) {
		return layer.polygons;
	}

	const layerPixelData = getLayerPixelData(document, layer, imageCache);

	polygons = polygons.map(polygon => {
		const polygonPoints = polygon.pointIndices
			.map(index => {
				let point = (points as Point[])[index];
				point = getAbsoluteDocumentPoint(point, document.dimensions);
				point = {
					x: point.x + (document.dimensions.width / 2),
					y: point.y + (document.dimensions.height / 2)
				};
				return point;
			}) as [Point, Point, Point];

		const color = getPolygonAverageColor(layerPixelData, polygonPoints);

		return {
			...polygon,
			color
		};
	});

	return polygons;
}

function renderLayer(
	context: CanvasRenderingContext2D,
	documentDimensions: Size,
	layer: Layer,
	selectedPointIndices: number[],
	isSelectedLayer: boolean,
	imageCache: ImageCache
) {
	runInTransaction(context, () => {
		if (isSelectedLayer) {
			if (layer.image.source) {
				const image = imageCache.getImage(layer.image.source);
				if (image.hasElementLoaded) {
					const bounds = getImageBounds(documentDimensions, layer);
					context.drawImage(image.element, bounds.x, bounds.y, bounds.width, bounds.height);
				}
			}
		}

		runInTransaction(context, () => {
			context.globalAlpha = .5;

			for (const polygon of layer.polygons) {
				renderPolygon(context, layer.points, polygon, documentDimensions);
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
	const POINT_FILL_COLOR = '#333';
	const POINT_STROKE_COLOR = '#eee';
	const RADIUS = 3;

	point = getAbsoluteDocumentPoint(point, documentDimensions);

	runInTransaction(context, () => {
		context.beginPath();

		context.ellipse(
			point.x,
			point.y,
			RADIUS,
			RADIUS,
			0,
			0,
			360
		);

		context.lineWidth = .5;
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

export function renderPolygon(
	context: CanvasRenderingContext2D,
	points: Point[],
	polygon: Polygon,
	documentDimensions: Size
) {
	context.beginPath();

	context.lineWidth = 1;
	context.fillStyle = `rgb(${ polygon.color.r }, ${ polygon.color.g }, ${ polygon.color.b })`;
	context.strokeStyle = '#333';
	const polygonPoints = polygon.pointIndices.map(pointIndex => {
		return getAbsoluteDocumentPoint(points[pointIndex], documentDimensions);
	});

	context.moveTo(polygonPoints[0].x, polygonPoints[0].y);
	context.lineTo(polygonPoints[1].x, polygonPoints[1].y);
	context.lineTo(polygonPoints[2].x, polygonPoints[2].y);
	context.closePath();
	context.fill();
	context.stroke();
}

export function renderProjectFile(
	context: CanvasRenderingContext2D,
	bounds: Rectangle,
	editor: Editor,
	imageCache: ImageCache
) {
	runInTransaction(context, () => {
		bounds = bounds;

		applyViewportTransform(context, bounds, editor);

		renderProjectFileBackground(context, editor);

		for (let layerIndex = 0; layerIndex < editor.document.layers.length; layerIndex++) {
			const layer = editor.document.layers[layerIndex];
			const isSelectedLayer = layerIndex === editor.selectedLayerIndex;
			if (layer.isVisible) {
				renderLayer(context, editor.document.dimensions, layer, editor.selectedPointIndices, isSelectedLayer, imageCache);
			}
		}
	});
}

const SELECTION_COLOR = '#337ab7';

export function renderSelectionRectangle(context: CanvasRenderingContext2D, rectangleInProjectSpace: Rectangle) {
	runInTransaction(context, () => {
		context.beginPath();

		context.rect(
			rectangleInProjectSpace.x,
			rectangleInProjectSpace.y,
			rectangleInProjectSpace.width,
			rectangleInProjectSpace.height
		);

		context.fillStyle = SELECTION_COLOR;
		context.globalAlpha = .15;
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

	context.lineDashOffset = DASH_LENGTH * 2 * ((Date.now() % STEP_ANIMATION_DURATION) / STEP_ANIMATION_DURATION);
	context.setLineDash([DASH_LENGTH, DASH_LENGTH]);
	context.strokeStyle = SELECTION_STROKE_COLOR_2;
	context.stroke();
}

export function renderTool(
	context: CanvasRenderingContext2D,
	bounds: Rectangle,
	helper: ToolHelper,
	tool: Tool<any>
) {
	runInTransaction(context, () => {
		context.beginPath();
		const editor = helper.getEditor();
		applyViewportTransform(context, bounds, editor);
		tool.render(helper, context, bounds);
	});
}

export function renderTransparencyTiles(context: CanvasRenderingContext2D, bounds: Rectangle, tileSize: number = 20) {
	runInTransaction(context, () => {
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

export function runInTransaction(context: CanvasRenderingContext2D, callback: () => void) {
	context.save();
	try {
		callback();
	} finally {
		context.restore();
	}
}

export function renderProjectFileBackground(context: CanvasRenderingContext2D, editor: Editor) {
	runInTransaction(context, () => {
		context.beginPath();

		context.lineWidth = 1;
		context.strokeStyle = '#333';
		context.fillStyle = 'rgba(255, 255, 255, .6)';

		const halfWidth = editor.document.dimensions.width / 2;
		const halfHeight = editor.document.dimensions.height / 2;

		context.rect(
			-halfWidth,
			-halfHeight,
			editor.document.dimensions.width,
			editor.document.dimensions.height
		);

		context.stroke();
		context.fill();

		const SHADOW_OFFSET = 5;

		context.beginPath();
		const SHADOW_COLOR_STOPS: GradientColorStep[] = [
			{ stop: 0, fillStyle: 'rgba(0, 0, 0, .3)' },
			{ stop: 1, fillStyle: 'rgba(0, 0, 0, .0)' }
		];

		context.fillStyle = createGradient(
			context,
			halfWidth + 1, 0, halfWidth + 1 + SHADOW_OFFSET, 0,
			SHADOW_COLOR_STOPS
		);
		context.rect(halfWidth + 1, -halfHeight + SHADOW_OFFSET, SHADOW_OFFSET, editor.document.dimensions.height);
		context.fill();

		context.beginPath();
		context.fillStyle = createGradient(
			context,
			0, halfHeight + 1, 0, halfHeight + 1 + SHADOW_OFFSET,
			SHADOW_COLOR_STOPS
		);
		context.rect(-halfWidth + SHADOW_OFFSET, halfHeight + 1, editor.document.dimensions.width, SHADOW_OFFSET);
		context.fill();
	});
}

export function renderDebugCrosshair(context: CanvasRenderingContext2D, point: Point, strokeStyle: string = '#f00') {
	const CROSS_HAIR_RADIUS = 15;

	runInTransaction(context, () => {
		context.beginPath();

		context.lineWidth = .5;
		context.strokeStyle = strokeStyle;

		context.rect(
			point.x - CROSS_HAIR_RADIUS,
			point.y - CROSS_HAIR_RADIUS,
			CROSS_HAIR_RADIUS * 2,
			CROSS_HAIR_RADIUS * 2
		);

		context.moveTo(
			point.x - CROSS_HAIR_RADIUS,
			point.y - CROSS_HAIR_RADIUS
		);
		context.lineTo(
			point.x + CROSS_HAIR_RADIUS,
			point.y + CROSS_HAIR_RADIUS
		);

		context.moveTo(
			point.x + CROSS_HAIR_RADIUS,
			point.y - CROSS_HAIR_RADIUS
		);
		context.lineTo(
			point.x - CROSS_HAIR_RADIUS,
			point.y + CROSS_HAIR_RADIUS
		);

		context.moveTo(
			point.x - CROSS_HAIR_RADIUS,
			point.y
		);
		context.lineTo(
			point.x + CROSS_HAIR_RADIUS,
			point.y
		);

		context.moveTo(
			point.x,
			point.y - CROSS_HAIR_RADIUS
		);
		context.lineTo(
			point.x,
			point.y + CROSS_HAIR_RADIUS
		);

		context.stroke();
	});
}
