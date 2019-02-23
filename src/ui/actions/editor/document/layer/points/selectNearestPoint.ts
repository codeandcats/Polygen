import assertNever from 'assert-never';
import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Nullable } from '../../../../../../shared/models/nullable';
import { Point } from '../../../../../../shared/models/point';
import { getDistanceBetweenPointsSquared } from '../../../../../../shared/utils/geometry';
import { mod } from '../../../../../../shared/utils/math';
import { tuple } from '../../../../../../shared/utils/tuple';
import { defineAction } from '../../../../../reduxWithLessSux/action';

const NearestPointDirections = tuple('up', 'down', 'left', 'right');

type NearestPointDirection = typeof NearestPointDirections[number];

const NearestPointDirectionVectors: { [key in NearestPointDirection]: Point } = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const NearestPointDirectionAngles: { [key in NearestPointDirection]: number } = NearestPointDirections
  .reduce((result, direction) => {
    const vector = NearestPointDirectionVectors[direction];
    result[direction] = Math.atan2(vector.y, vector.x);
    return result;
  }, {} as Partial<{ [key in NearestPointDirection]: number }>) as { [key in NearestPointDirection]: number };

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
          const selectedPointIndices: number[] = (
            indexOfNearestPoint === -1 ?
            editor.selectedPointIndices :
            [indexOfNearestPoint]
          );
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

function getDistanceWeighted(point: Point, origin: Point, preferredDirection: NearestPointDirection): number {
  const directionAngle = NearestPointDirectionAngles[preferredDirection];
  const distance = Math.abs(getDistanceBetweenPointsSquared(point, origin));
  const angle = getAngleToPoint(point, origin);

  // =IF(ABS(C31-G31)>=PI(), PI() - MOD(ABS(C31-G31), PI()), ABS(C31-G31))
  let angleDifference = Math.abs(directionAngle - angle);
  angleDifference = (
    (angleDifference >= Math.PI) ?
    Math.PI - mod(angleDifference, Math.PI) :
    angleDifference
  );

  const weight = (1 + angleDifference) * (1 + angleDifference);

  const result = Math.abs(distance * weight);

  return result;
}

export function getIndexOfNearestPoint(points: Point[], origin: Point, direction: NearestPointDirection): number {
  let nearestDistance = Number.POSITIVE_INFINITY;

  const pointsInDirection = points.filter(point => isPointInDirectionOfOrigin(point, origin, direction));

  const nearestPointIndex = points.reduce((result, point, index) => {
    if (isPointInDirectionOfOrigin(point, origin, direction)) {
      const distance = getDistanceWeighted(point, origin, direction);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        return index;
      }
    }
    return result;
  }, -1);

  return nearestPointIndex;
}

export function getAngleToPoint(point: Point, origin: Point): number {
  return Math.atan2(point.y - origin.y, point.x - origin.x);
}

export function isPointInDirectionOfOrigin(point: Point, origin: Point, direction: NearestPointDirection): boolean {
  const vector: Point = { x: point.x - origin.x, y: point.y - origin.y };

  return (
    (direction === 'up' && vector.y < 0) ||
    (direction === 'down' && vector.y > 0) ||
    (direction === 'left' && vector.x < 0) ||
    (direction === 'right' && vector.x > 0)
  );
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

export function calculateDeviationFromInRadians(point1: Point, point2: Point) {
  const angle1 = getAngleToPoint(point1, { x: 0, y: 0 });
  const angle2 = getAngleToPoint(point2, { x: 0, y: 0 });
  return Math.abs(angle1 - angle2);
}
