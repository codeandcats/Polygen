import { Rectangle } from '../../shared/models/rectangle';

export function drawTransparencyTiles(context: CanvasRenderingContext2D, rect: Rectangle, tileSize: number = 20) {
	const squareColour = ['#FFF', '#DDD'];
	for (let y = 0; y * tileSize < rect.height; y++) {
		for (let x = 0; x * tileSize < rect.width; x++) {
			const colourIndex = (x + y) % 2;
			context.fillStyle = squareColour[colourIndex];
			context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
		}
	}
}
