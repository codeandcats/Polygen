import { Editor } from '../../shared/models/editor';
import { Layer } from '../../shared/models/layer';
import { Point } from '../../shared/models/point';
import { ProjectFile } from '../../shared/models/projectFile';
import { Rectangle } from '../../shared/models/rectangle';
import { Tool, ToolHelper } from '../models/tools/common';

export function renderTransparencyTiles(context: CanvasRenderingContext2D, bounds: Rectangle, tileSize: number = 20) {
	context.save();
	try {
		const squareColour = ['#FFF', '#DDD'];
		for (let y = 0; y * tileSize < bounds.height; y++) {
			for (let x = 0; x * tileSize < bounds.width; x++) {
				const colourIndex = (x + y) % 2;
				context.fillStyle = squareColour[colourIndex];
				context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
			}
		}
	} finally {
		context.restore();
	}
}

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

export function renderProjectFile(
	context: CanvasRenderingContext2D,
	bounds: Rectangle,
	editor: Editor
) {
	context.save();
	try {
		bounds = bounds;

		applyViewportTransform(context, bounds, editor);

		drawProjectFileBackground(context, editor);

		for (const layer of editor.projectFile.layers) {
			renderLayer(context, layer);
		}
	} finally {
		context.restore();
	}
}

function renderLayer(context: CanvasRenderingContext2D, layer: Layer) {
	context.save();
	try {
		for (const point of layer.points) {
			renderPoint(context, point);
		}
	} finally {
		context.restore();
	}
}

export function renderTool(
	context: CanvasRenderingContext2D,
	bounds: Rectangle,
	helper: ToolHelper,
	tool: Tool<any>
) {
	context.save();
	try {
		context.beginPath();
		const editor = helper.getEditor();
		applyViewportTransform(context, bounds, editor);
		tool.render(helper, context, bounds);
	} finally {
		context.restore();
	}
}

export function renderPoint(context: CanvasRenderingContext2D, point: Point) {
	const RADIUS = 4;
	context.beginPath();
	context.lineWidth = 1;
	context.fillStyle = '#333';
	context.strokeStyle = '#eee';
	context.ellipse(
		point.x,
		point.y,
		RADIUS,
		RADIUS,
		0,
		0,
		360
	);
	context.fill();
	context.stroke();
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

export function drawProjectFileBackground(context: CanvasRenderingContext2D, editor: Editor) {
	context.save();
	try {
		context.beginPath();

		context.lineWidth = 1;
		context.strokeStyle = '#333';
		context.fillStyle = 'rgba(255, 255, 255, .5)';

		const halfWidth = editor.projectFile.size.width / 2;
		const halfHeight = editor.projectFile.size.height / 2;

		context.rect(
			-halfWidth,
			-halfHeight,
			editor.projectFile.size.width,
			editor.projectFile.size.height
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
		context.rect(halfWidth + 1, -halfHeight + SHADOW_OFFSET, SHADOW_OFFSET, editor.projectFile.size.height);
		context.fill();

		context.beginPath();
		context.fillStyle = createGradient(
			context,
			0, halfHeight + 1, 0, halfHeight + 1 + SHADOW_OFFSET,
			SHADOW_COLOR_STOPS
		);
		context.rect(-halfWidth + SHADOW_OFFSET, halfHeight + 1, editor.projectFile.size.width, SHADOW_OFFSET);
		context.fill();

	} finally {
		context.restore();
	}
}

export function drawDebugCrossHair(context: CanvasRenderingContext2D, point: Point, strokeStyle: string = '#f00') {
	const CROSS_HAIR_RADIUS = 15;
	context.save();
	try {
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
	} finally {
		context.restore();
	}
}
