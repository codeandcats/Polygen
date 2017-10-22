import { tuple } from '../../../shared/lang/tuple';
import { ApplicationState } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { Point } from '../../../shared/models/point';
import { Rectangle } from '../../../shared/models/rectangle';
import { Store } from '../../reduxWithLessSux/store';

export const ALL_TOOL_NAMES = tuple('pan', 'point', 'selection');

export type ToolName = typeof ALL_TOOL_NAMES[number];

declare let e: HTMLCanvasElement;

export interface ToolHelper {
	getEditor(): Editor;
	getMouseCursor(): string;
	addPoint(point: Point): void;
	getToolState(): any;
	setMouseCursor(cursor: string): void;
	setToolState(state: any): void;
}

export abstract class Tool<TToolState> {
	public abstract readonly name: ToolName;
	public abstract readonly iconClassName: string;
	public abstract readonly displayName: string;

	public mouseDown(
		helper: ToolHelper,
		event: React.MouseEvent<HTMLCanvasElement>
	): void {
		// Just to remove compiler warnings about unused variables
		helper = helper;
		event = event;
	}

	public mouseMove(
		helper: ToolHelper,
		event: React.MouseEvent<HTMLCanvasElement>
	): void {
		// Just to remove compiler warnings about unused variables
		helper = helper;
		event = event;
	}

	public mouseUp(
		helper: ToolHelper,
		event: React.MouseEvent<HTMLCanvasElement>
	): void {
		// Just to remove compiler warnings about unused variables
		helper = helper;
		event = event;
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
	}
}
