import { Point } from '../models/point';

export function addPoints(...points: Point[]): Point {
	const result: Point = { x: 0, y: 0 };
	for (const point of points) {
		result.x += point.x;
		result.y += point.y;
	}
	return result;
}

export function subtractPoints(point1: Point, point2: Point): Point {
	const result = {
		x: point1.x - point2.x,
		y: point1.y - point2.y
	};
	return result;
}
