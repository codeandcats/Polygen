import { Point } from '../../../shared/models/point';
import { Rectangle } from '../../../shared/models/rectangle';
import { MouseButton } from '../mouseButton';
import { CanvasMouseEvent, Tool, ToolHelper, ToolName } from './common';

interface PointBeingAdded {
	point: Point;
	addTime: number;
}

interface PointToolState {
	addingPoints: PointBeingAdded;
}

export class PointTool extends Tool<PointToolState> {
	public readonly name: ToolName = 'point';
	public readonly iconClassName = 'fa-pencil';
	public readonly displayName = 'Point';

	private static CURSOR = 'crosshair';

	public mouseDown(
		helper: ToolHelper// ,
		// event: React.MouseEvent<HTMLCanvasElement>
	): void {
		helper.setMouseCursor(PointTool.CURSOR);
	}

	public mouseMove(
		helper: ToolHelper// ,
		// event: React.MouseEvent<HTMLCanvasElement>
	): void {
		helper.setMouseCursor(PointTool.CURSOR);
	}

	public mouseUp(
		helper: ToolHelper,
		event: CanvasMouseEvent
	): void {
		console.log(`PointTool.mouseUp: buttons = `, event.buttons);
		helper.setMouseCursor(PointTool.CURSOR);
		if (event.buttons.left) {
			console.log(`Clicked at ${ event.viewPortPoint.x },${ event.viewPortPoint.y }`);
			console.log(`Added at ${ event.projectFilePoint.x },${ event.projectFilePoint.y }`);
			helper.actions.addPoint(event.projectFilePoint);
		}
	}

	public render(
		helper: ToolHelper,
		context: CanvasRenderingContext2D,
		bounds: Rectangle
	): void {
		// Just to remove compiler warnings about unused variables
		helper = helper;
		context = context;
		bounds = bounds;
		event = event;

		// const editor = helper.getEditor();
		// context.ellipse()
	}
}
