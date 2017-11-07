import assertNever from 'assert-never';
import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Point } from '../../../../../../shared/models/point';
import { getDistanceBetweenPointsSquared } from '../../../../../../shared/utils/geometry';
import { defineAction } from '../../../../../reduxWithLessSux/action';

type NearestPointDirection = 'up' | 'down' | 'right' | 'left';

interface SelectNearestPointPayload {
	direction: NearestPointDirection;
}

export const selectNearestPoint = defineAction(
	'selectNearestPoint', (state: ApplicationState, payload: SelectNearestPointPayload) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				const selectedLayer = editor.document.layers[editor.selectedLayerIndex];
				const furthermostSelectedPointIndex = getIndexOfFurthermostPointInDirection(
					selectedLayer.points,
					editor.selectedPointIndices,
					payload.direction
				);
				if (furthermostSelectedPointIndex > -1) {
					const indexOfNearestPoint = getIndexOfNearestPoint(
						selectedLayer.points,
						selectedLayer.points[furthermostSelectedPointIndex],
						payload.direction
					);
					const selectedPointIndices: number[] = [indexOfNearestPoint];
					return {
						...editor,
						selectedPointIndices
					};
				}
			}
			return editor;
		});

		return {
			...state,
			editors
		};
	}
).getDispatcher();

export function getIndexOfNearestPoint(points: Point[], origin: Point, direction: NearestPointDirection): number {
	let nearestDifference = Number.POSITIVE_INFINITY;
	const nearestPointIndex = points.reduce((result, point, index) => {
		if (isPointInDirectionOfOrigin(point, origin, direction)) {
			const difference = Math.abs(getDistanceBetweenPointsSquared(point, origin));
			if (difference < nearestDifference) {
				nearestDifference = difference;
				return index;
			}
		}
		return result;
	}, -1);

	return nearestPointIndex;
}

export function isPointInDirectionOfOrigin(point: Point, origin: Point, direction: NearestPointDirection): boolean {
	switch (direction) {
		case 'up': return point.y < origin.y;
		case 'left': return point.x < origin.x;
		case 'right': return point.x > origin.x;
		case 'down': return point.y > origin.y;
		default: return assertNever(direction);
	}
}

export function getIndexOfFurthermostPointInDirection(
	points: Point[],
	withinIndices: number[],
	direction: NearestPointDirection
): number {
	if (!withinIndices.length) {
		return -1;
	}

	function getDirectionValue(point: Point) {
		switch (direction) {
			case 'up': return -point.y;
			case 'down': return point.y;
			case 'left': return -point.x;
			case 'right': return point.x;
			default: return assertNever(direction);
		}
	}

	let furthermostPointValue = 0;

	const furthermostPointIndex = withinIndices.reduce((result, index) => {
		const value = getDirectionValue(points[index]);
		if (result === -1 || value > furthermostPointValue) {
			furthermostPointValue = value;
			result = index;
		}
		return result;
	}, -1);

	return furthermostPointIndex;
}
