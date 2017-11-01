import { Editor } from '../../shared/models/editor';
import { Layer } from '../../shared/models/layer';
import { Point } from '../../shared/models/point';
import { Polygon } from '../../shared/models/polygon';
import { ProjectFile } from '../../shared/models/projectFile';
import { Rectangle } from '../../shared/models/rectangle';
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

function renderLayer(context: CanvasRenderingContext2D, layer: Layer, selectedPointIndices: number[]) {
	runInTransaction(context, () => {
		for (const polygon of layer.polygons) {
			renderPolygon(context, layer.points,  polygon);
		}

		const selectedPointMap = selectedPointIndices.reduce((result, index) => {
			result[index] = true;
			return result;
		}, {} as { [index: number]: boolean | undefined });

		for (let pointIndex = 0; pointIndex < layer.points.length; pointIndex++) {
			const point = layer.points[pointIndex];
			const isSelected = !!selectedPointMap[pointIndex];
			renderPoint(context, point, isSelected);
		}
	});
}

export function renderPoint(context: CanvasRenderingContext2D, point: Point, isSelected: boolean) {
	const POINT_FILL_COLOR = '#333';
	const POINT_STROKE_COLOR = '#eee';
	const RADIUS = 3;

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

export function renderPolygon(context: CanvasRenderingContext2D, points: Point[], polygon: Polygon) {
	context.beginPath();

	context.lineWidth = 1;
	context.fillStyle = '#ccc';
	context.strokeStyle = '#333';
	const polygonPoints = polygon.pointIndices.map(pointIndex => points[pointIndex]);

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
	editor: Editor
) {
	runInTransaction(context, () => {
		bounds = bounds;

		applyViewportTransform(context, bounds, editor);

		renderProjectFileBackground(context, editor);

		for (const layer of editor.projectFile.layers) {
			renderLayer(context, layer, editor.selectedPointIndices);
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

function renderSelectionStroke(context: CanvasRenderingContext2D) {
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
		context.fillStyle = 'rgba(255, 255, 255, .5)';

		const halfWidth = editor.projectFile.dimensions.width / 2;
		const halfHeight = editor.projectFile.dimensions.height / 2;

		context.rect(
			-halfWidth,
			-halfHeight,
			editor.projectFile.dimensions.width,
			editor.projectFile.dimensions.height
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
		context.rect(halfWidth + 1, -halfHeight + SHADOW_OFFSET, SHADOW_OFFSET, editor.projectFile.dimensions.height);
		context.fill();

		context.beginPath();
		context.fillStyle = createGradient(
			context,
			0, halfHeight + 1, 0, halfHeight + 1 + SHADOW_OFFSET,
			SHADOW_COLOR_STOPS
		);
		context.rect(-halfWidth + SHADOW_OFFSET, halfHeight + 1, editor.projectFile.dimensions.width, SHADOW_OFFSET);
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
