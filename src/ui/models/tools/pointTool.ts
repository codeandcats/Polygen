import * as eases from 'eases';
import { Point } from '../../../shared/models/point';
import { Rectangle } from '../../../shared/models/rectangle';
import { getAnimationProgress } from '../../utils/animation';
import { getAbsoluteDocumentPoint, renderPoint } from '../../utils/graphics';
import { MouseButton } from '../mouseButton';
import { CanvasMouseState, Tool, ToolHelper, ToolName } from './common';

interface PointBeingAdded {
  point: Point;
  time: number;
}

interface PointToolState {
  pointsBeingAdded: PointBeingAdded[];
}

export class PointTool extends Tool {
  public readonly name: ToolName = 'point';
  public readonly iconClassName = 'fa-pencil';
  public readonly displayName = 'Point Tool';

  private static readonly ANIMATION_DURATION = 400;

  private static CURSOR = 'crosshair';

  public mouseDown(helper: ToolHelper): void {
    helper.setMouseCursor(PointTool.CURSOR);
  }

  public mouseMove(helper: ToolHelper): void {
    helper.setMouseCursor(PointTool.CURSOR);
  }

  public mouseUp(helper: ToolHelper, mouse: CanvasMouseState): void {
    helper.setMouseCursor(PointTool.CURSOR);
    if (mouse.buttons.left) {
      this.startPointAnimation(helper, mouse.documentPoint);
    }
  }

  private startPointAnimation(helper: ToolHelper, point: Point) {
    helper.setToolState((state: PointToolState | undefined) => {
      let pointsBeingAdded: PointBeingAdded[] =
        (state && state.pointsBeingAdded) || [];

      pointsBeingAdded = pointsBeingAdded.concat({
        point: { ...point },
        time: Date.now(),
      });

      state = {
        ...state,
        pointsBeingAdded,
      };

      setTimeout(
        () => this.endPointAnimation(helper),
        PointTool.ANIMATION_DURATION
      );
      return state;
    });
  }

  private endPointAnimation(helper: ToolHelper) {
    helper.setToolState((state: PointToolState | undefined) => {
      const pointsBeingAdded: PointBeingAdded[] = (
        (state && state.pointsBeingAdded) ||
        []
      ).concat();
      if (pointsBeingAdded.length) {
        const pointBeingAdded = pointsBeingAdded.splice(0, 1)[0];
        state = {
          ...state,
          pointsBeingAdded,
        };
        helper.actions.addPoint(pointBeingAdded.point);
      }
      return state;
    });
  }

  public render(helper: ToolHelper, context: CanvasRenderingContext2D): void {
    const documentDimensions = helper.getEditor().document.dimensions;
    const currentTime = Date.now();
    const toolState: PointToolState = helper.getToolState();
    const pointsBeingAdded =
      (toolState && toolState.pointsBeingAdded) || ([] as PointBeingAdded[]);
    for (const pointBeingAdded of pointsBeingAdded) {
      context.save();
      try {
        const animationProgress = getAnimationProgress(
          pointBeingAdded.time,
          PointTool.ANIMATION_DURATION,
          currentTime
        );
        const scaleAnimationProgress = eases.elasticOut(animationProgress);

        const absoluteDocumentPoint = getAbsoluteDocumentPoint(
          pointBeingAdded.point,
          documentDimensions
        );

        context.translate(absoluteDocumentPoint.x, absoluteDocumentPoint.y);
        const scale = scaleAnimationProgress;
        context.scale(scale, scale);

        // const radius = 3 * eases.elasticOut(animationProgress);
        const radius = 3;
        // context.fillStyle = `rgba(51, 51, 51, ${ eases.linear(animationProgress) })`;
        renderPoint(context, { x: 0, y: 0 }, documentDimensions, false);
      } finally {
        context.restore();
      }
    }
  }
}
