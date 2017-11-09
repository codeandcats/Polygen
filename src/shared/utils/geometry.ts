import * as cdt2d from 'cdt2d';
import { Point } from '../models/point';
import { Polygon } from '../models/polygon';
import { Rectangle } from '../models/rectangle';
import { Size } from '../models/size';

export function addPoints(...points: Point[]): Point {
	const result: Point = { x: 0, y: 0 };
	for (const point of points) {
		result.x += point.x;
		result.y += point.y;
	}
	return result;
}

export function forEachPointWithinPolygon(
	polygon: [Point, Point, Point],
	callback: (point: Point) => boolean | void
) {
	const bounds = getPolygonBoundingRectangle(polygon);
	const left = Math.floor(bounds.x);
	const right = Math.ceil(bounds.x + bounds.width);
	const top = Math.floor(bounds.y);
	const bottom = Math.ceil(bounds.y + bounds.height);

	for (let x = left; x <= right; x++) {
		for (let y = top; y <= bottom; y++) {
			const point = { x, y };
			const isWithinPolygon = isPointInPolygon(point, polygon);
			if (isWithinPolygon) {
				const result = callback(point);
				if (typeof result === 'boolean' && !result) {
					return;
				}
			}
		}
	}
}

export function getCenter(size: Size): Point {
	return {
		x: size.width / 2,
		y: size.height / 2
	};
}

export function getDistanceBetweenPointsSquared(pointA: Point, pointB: Point): number {
	const xDiff = pointB.x - pointA.x;
	const yDiff = pointB.y - pointA.y;
	const result = (xDiff * xDiff) + (yDiff * yDiff);
	return result;
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

export function getPolygonBoundingRectangle([p0, p1, p2]: [Point, Point, Point]): Rectangle {
	const left = Math.min(p0.x, p1.x, p2.x);
	const top = Math.min(p0.y, p1.y, p2.y);
	const right = Math.max(p0.x, p1.x, p2.x);
	const bottom = Math.max(p0.y, p1.y, p2.y);

	return {
		x: left,
		y: top,
		width: right - left,
		height: bottom - top
	};
}

export function isPointInPolygon(point: Point, triangle: [Point, Point, Point]): boolean {
	const [p0, p1, p2] = triangle;
	const A = 0.5 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
	const sign = A < 0 ? -1 : 1;
	const s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * point.x + (p0.x - p2.x) * point.y) * sign;
	const t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * point.x + (p1.x - p0.x) * point.y) * sign;
	return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}

export function isPointInRectangle(point: Point, rectangle: Rectangle): boolean {
	return (
		point.x >= rectangle.x &&
		point.x <= rectangle.x + rectangle.width &&
		point.y >= rectangle.y &&
		point.y <= rectangle.y + rectangle.height
	);
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
			color: { r: 0, g: 0, b: 0, a: 0 },
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
