import { Point } from '../../../shared/models/point';
import { getIndicesOfPointsInRectangle, pointsToRectangle } from '../../../shared/utils/geometry';
import { getImageBounds, renderSelectionStroke } from '../../utils/graphics';
import { CanvasMouseState, Tool, ToolHelper, ToolName } from './common';

interface ImageBoundsToolState {
}

export class ImageBoundsTool extends Tool<ImageBoundsToolState> {
	public readonly name: ToolName = 'imageBounds';
	public readonly iconClassName = 'fa-arrows-alt';
	public readonly displayName = 'Image Bounds Tool';

	private static CURSOR = 'default';

	public mouseDown(
		helper: ToolHelper
	): void {
		helper.setMouseCursor(ImageBoundsTool.CURSOR);
	}

	public mouseMove(
		helper: ToolHelper
	): void {
		helper.setMouseCursor(ImageBoundsTool.CURSOR);
	}

	public mouseUp(
		helper: ToolHelper
	): void {
		helper.setMouseCursor(ImageBoundsTool.CURSOR);
	}

	public render(
		helper: ToolHelper,
		context: CanvasRenderingContext2D
	): void {
		const editor = helper.getEditor();
		const layer = editor.projectFile.layers[editor.selectedLayerIndex];
		const bounds = getImageBounds(editor.projectFile.dimensions, layer);

		if (layer.image.source) {
			context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
			renderSelectionStroke(context);
			context.stroke();
		}
	}
}
