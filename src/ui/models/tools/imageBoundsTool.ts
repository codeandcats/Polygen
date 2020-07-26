import { getImageBounds, renderSelectionStroke } from '../../utils/graphics';
import { Tool, ToolHelper, ToolName } from './common';

export class ImageBoundsTool extends Tool {
  public readonly name: ToolName = 'imageBounds';
  public readonly iconClassName = 'fa-arrows-alt';
  public readonly displayName = 'Image Bounds Tool';

  private static CURSOR = 'default';

  public mouseDown(helper: ToolHelper): void {
    helper.setMouseCursor(ImageBoundsTool.CURSOR);
  }

  public mouseMove(helper: ToolHelper): void {
    helper.setMouseCursor(ImageBoundsTool.CURSOR);
  }

  public mouseUp(helper: ToolHelper): void {
    helper.setMouseCursor(ImageBoundsTool.CURSOR);
  }

  public render(helper: ToolHelper, context: CanvasRenderingContext2D): void {
    const editor = helper.getEditor();
    const layer = editor.document.layers[editor.selectedLayerIndex];
    const bounds = getImageBounds(editor.document.dimensions, layer);

    if (layer.image.imageId) {
      context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
      renderSelectionStroke(context);
      context.stroke();
    }
  }
}
