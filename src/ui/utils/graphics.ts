import { Editor } from '../../shared/models/editor';
import { Layer } from '../../shared/models/layer';
import { Point } from '../../shared/models/point';
import { ProjectFile } from '../../shared/models/projectFile';
import { Rectangle } from '../../shared/models/rectangle';

export function drawTransparencyTiles(context: CanvasRenderingContext2D, bounds: Rectangle, tileSize: number = 20) {
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

export function drawProjectFile(context: CanvasRenderingContext2D, bounds: Rectangle, editor: Editor) {
	context.save();
	try {
		bounds = bounds;
		// context.fillStyle = '#ff0';
		// context.strokeStyle = '#f00';
		// context.fillRect(0, 0, 30, 30);
		// context.strokeRect(0, 0, 30, 30);

		context.translate(
			bounds.width / 2,
			bounds.height / 2
		);

		drawProjectFileBackground(context, editor);

		drawDebugCrossHair(context, { x: 0, y: 0 });

		for (const layer of editor.projectFile.layers) {
			// drawLayer(context, bounds, editor, layer);
		}
	} finally {
		context.restore();
	}
}

// export function drawLayer(context: CanvasRenderingContext2D, bounds: Rectangle, editor: Editor, layer: Layer) {
// 	context.save();
// 	try {
// 		context.
// 	} finally {
// 		context.restore();
// 	}
// }

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
		context.strokeStyle = '#999';
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
