import { Point } from '../../../shared/models/point';
import { addPoints, subtractPoints } from '../../../shared/utils/geometry';
import { CanvasMouseState, Tool, ToolHelper, ToolName } from './common';

interface PanToolState {
	panStart: Point | undefined;
}

export class PanTool extends Tool<PanToolState> {
	public readonly name: ToolName = 'pan';
	public readonly iconClassName = 'fa-hand-paper-o';
	public readonly displayName = 'Pan Tool';

	private calculateNewPan(helper: ToolHelper, currentViewPortPoint: Point): Point {
		const pan = helper.getEditor().viewPort.pan || { x: 0, y: 0 };
		const toolState: PanToolState = helper.getToolState() || {};

		const movedDistance = toolState.panStart ?
			subtractPoints(currentViewPortPoint, toolState.panStart) :
			{ x: 0, y: 0 };

		const result = addPoints(pan, movedDistance);

		return result;
	}

	public mouseDown(
		helper: ToolHelper,
		mouse: CanvasMouseState
	): void {
		helper.setMouseCursor('-webkit-grab');
		if (mouse.buttons.left) {
			helper.setMouseCursor('-webkit-grabbing');
			helper.setToolState({
				panStart: { ...mouse.viewPortPoint }
			});
		}
	}

	public mouseMove(
		helper: ToolHelper,
		mouse: CanvasMouseState
	): void {
		if (mouse.buttons.left) {
			helper.setMouseCursor('-webkit-grabbing');
			const pan = this.calculateNewPan(helper, mouse.viewPortPoint);
			helper.actions.setPan(pan);
			helper.setToolState({
				panStart: { ...mouse.viewPortPoint }
			});
		} else {
			helper.setMouseCursor('-webkit-grab');
		}
	}

	public mouseUp(
		helper: ToolHelper,
		mouse: CanvasMouseState
	): void {
		if (mouse.buttons.left) {
			helper.setMouseCursor('-webkit-grab');
			const pan = this.calculateNewPan(helper, mouse.viewPortPoint);
			helper.actions.setPan(pan);
			helper.setToolState({
				panStart: undefined
			});
		}
	}
}
