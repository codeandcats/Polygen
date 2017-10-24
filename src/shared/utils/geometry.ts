import * as cdt2d from 'cdt2d';
import { Point } from '../models/point';
import { Polygon } from '../models/polygon';
import { Rectangle } from '../models/rectangle';

export function addPoints(...points: Point[]): Point {
	const result: Point = { x: 0, y: 0 };
	for (const point of points) {
		result.x += point.x;
		result.y += point.y;
	}
	return result;
}

export function isPointInRectangle(point: Point, rectangle: Rectangle): boolean {
	return (
		point.x >= rectangle.x &&
		point.x <= rectangle.x + rectangle.width &&
		point.y >= rectangle.y &&
		point.y <= rectangle.y + rectangle.height
	);
}

export function getIndicesOfPointsInRectangle(points: Point[], rectangle: Rectangle): number[] {
	const indices: number[] = [];
	for (let index = 0; index < points.length; index++) {
		const point = points[index];
		if (isPointInRectangle(point, rectangle)) {
			indices.push(index);
		}
	}
	return indices;
}

export function pointsToRectangle(point1: Point, point2: Point): Rectangle {
	const minX = Math.min(point1.x, point2.x);
	const minY = Math.min(point1.y, point2.y);
	const maxX = Math.max(point1.x, point2.x);
	const maxY = Math.max(point1.y, point2.y);

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY
	};
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

export function subtractPoints(point1: Point, point2: Point): Point {
	const result = {
		x: point1.x - point2.x,
		y: point1.y - point2.y
	};
	return result;
}
