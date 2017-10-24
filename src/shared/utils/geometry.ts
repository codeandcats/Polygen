import * as cdt2d from 'cdt2d';
import { Point } from '../models/point';
import { Polygon } from '../models/polygon';

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

export function recalculatePolygons(points: Point[]): Polygon[] {
	const pointTuples: cdt2d.Point[] = points.map(point => [point.x, point.y] as cdt2d.Point);
	const polygonPointIndices = cdt2d(pointTuples);
	const polygons: Polygon[] = new Array<Polygon>(polygonPointIndices.length);

	for (let polygonIndex = 0; polygonIndex < polygonPointIndices.length; polygonIndex++) {
		polygons[polygonIndex] = {
			color: { r: 0, g: 0, b: 0 },
			pointIndices: polygonPointIndices[polygonIndex]
		};
	}

	return polygons;
}
