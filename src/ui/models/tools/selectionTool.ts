import { Point } from '../../../shared/models/point';
import { getIndicesOfPointsInRectangle, pointsToRectangle } from '../../../shared/utils/geometry';
import { renderSelectionRectangle } from '../../utils/graphics';
import { CanvasMouseState, Tool, ToolHelper, ToolName } from './common';

interface SelectionToolState {
	startPoint: Point | undefined;
	endPoint: Point | undefined;
}

export class SelectionTool extends Tool<SelectionToolState> {
	public readonly name: ToolName = 'selection';
	public readonly iconClassName = 'fa-square-o';
	public readonly displayName = 'Selection Tool';

	private static CURSOR = 'crosshair';

	public mouseDown(
		helper: ToolHelper,
		mouse: CanvasMouseState
	): void {
		if (mouse.buttons.left) {
			helper.setToolState({
				startPoint: { ...mouse.viewPortPoint },
				endPoint: { ...mouse.viewPortPoint }
			});
		}
	}

	public mouseMove(
		helper: ToolHelper,
		mouse: CanvasMouseState
	): void {
		helper.setMouseCursor(SelectionTool.CURSOR);
		if (mouse.buttons.left) {
			let toolState: SelectionToolState = helper.getToolState() || {};
			if (toolState.startPoint) {
				toolState = {
					...toolState,
					endPoint: { ...mouse.viewPortPoint }
				};
				helper.setToolState(toolState);
				const selectionRectangle = pointsToRectangle(toolState.startPoint as Point, toolState.endPoint as Point);
			}
		}
	}

	public mouseUp(
		helper: ToolHelper,
		mouse: CanvasMouseState
	): void {
		if (mouse.buttons.left) {
			const toolState: SelectionToolState = helper.getToolState() || {};
			if (toolState.startPoint) {
				const startPoint = helper.translation.viewPortToDocument(toolState.startPoint);
				const endPoint = { ...mouse.documentPoint };
				const selectionRectangle = pointsToRectangle(startPoint, endPoint);
				const editor = helper.getEditor();
				const points = editor.document.layers[editor.selectedLayerIndex].points;
				const pointIndices = getIndicesOfPointsInRectangle(points, selectionRectangle);
				helper.actions.selectPoints(pointIndices);
			}

			helper.setToolState({
				startPoint: undefined,
				endPoint: undefined
			});
		}
	}

	public render(
		helper: ToolHelper,
		context: CanvasRenderingContext2D
	): void {
		const toolState: SelectionToolState = helper.getToolState();
		if (!toolState || !toolState.startPoint || !toolState.endPoint) {
			return;
		}

		const startPoint = helper.translation.viewPortToDocument(toolState.startPoint);
		const endPoint = helper.translation.viewPortToDocument(toolState.endPoint);

		const rectangle = pointsToRectangle(startPoint, endPoint);
		renderSelectionRectangle(context, rectangle);
	}
}
