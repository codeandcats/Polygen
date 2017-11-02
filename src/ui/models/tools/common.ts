import { ApplicationState } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { Point } from '../../../shared/models/point';
import { Rectangle } from '../../../shared/models/rectangle';
import { tuple } from '../../../shared/utils/tuple';
import { Store } from '../../reduxWithLessSux/store';

export const ALL_TOOL_NAMES = tuple('imageBounds', 'pan', 'point', 'selection');

export type ToolName = typeof ALL_TOOL_NAMES[number];

declare let e: HTMLCanvasElement;

export interface ToolHelperActions {
	addPoint(point: Point): void;
	setPan(point: Point): void;
	selectPoints(pointIndices: number[]): void;
}

export interface ToolHelperTranslation {
	viewPortToProjectFile: (point: Point) => Point;
	projectFileToViewPort: (point: Point) => Point;
}

export interface ToolHelper {
	actions: ToolHelperActions;
	getEditor(): Editor;
	getMouseCursor(): Cursor | string;
	getToolState(): any | undefined;
	setMouseCursor(cursor: Cursor | string): void;
	setToolState(stateOrCallback: any | ((state: any) => any)): void;
	translation: ToolHelperTranslation;
}

export interface CanvasMouseButtonsState {
	left: boolean;
	middle: boolean;
	right: boolean;
}

export interface CanvasMouseState {
	buttons: CanvasMouseButtonsState;
	projectFilePoint: Point;
	viewPortPoint: Point;
}

export abstract class Tool<TToolState> {
	public abstract readonly name: ToolName;
	public abstract readonly iconClassName: string;
	public abstract readonly displayName: string;

	public keyDown(
		helper: ToolHelper,
		event: React.KeyboardEvent<HTMLCanvasElement>
	) {
		// Just to remove compiler warnings about unused variables
		helper = helper;
		event = event;
	}

	public keyUp(
		helper: ToolHelper,
		event: React.KeyboardEvent<HTMLCanvasElement>
	) {
		// Just to remove compiler warnings about unused variables
		helper = helper;
		event = event;
	}

	public mouseDown(
		helper: ToolHelper,
		event: CanvasMouseState
	): void {
		// Just to remove compiler warnings about unused variables
		helper = helper;
		event = event;
	}

	public mouseMove(
		helper: ToolHelper,
		event: CanvasMouseState
	): void {
		// Just to remove compiler warnings about unused variables
		helper = helper;
		event = event;
	}

	public mouseUp(
		helper: ToolHelper,
		event: CanvasMouseState
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

export const ALL_CURSORS = tuple(
	'default', 'none', 'help', 'pointer', 'progress',
	'wait', 'cell', 'crosshair', 'text', 'vertical-text',
	'copy', 'move', 'no-drop', 'not-allowed', 'all-scroll',
	'col-resize', 'row-resize', 'n-resize', 'e-resize',
	's-resize', 'w-resize', 'ne-resize', 'nw-resize',
	'se-resize', 'sw-resize', 'ew-resize', 'ns-resize',
	'nesw-resize', 'nwse-resize', 'zoom-in', 'zoom-out',
	'grab', 'grabbing'
);

export type Cursor = typeof ALL_CURSORS[number];
