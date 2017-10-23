import { tuple } from '../../../shared/lang/tuple';
import { ApplicationState } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { Point } from '../../../shared/models/point';
import { Rectangle } from '../../../shared/models/rectangle';
import { Store } from '../../reduxWithLessSux/store';

export const ALL_TOOL_NAMES = tuple('pan', 'point', 'selection');

export type ToolName = typeof ALL_TOOL_NAMES[number];

declare let e: HTMLCanvasElement;

export interface ToolHelperActions {
	addPoint(point: Point): void;
}

export interface ToolHelperTranslation {
	viewPortToProjectFile: (point: Point) => Point;
	projectFileToViewPort: (point: Point) => Point;
}

export interface ToolHelper {
	actions: ToolHelperActions;
	getEditor(): Editor;
	getMouseCursor(): string;
	getToolState(): any | undefined;
	setMouseCursor(cursor: string): void;
	setToolState(stateOrCallback: any | ((state: any) => any)): void;
	translation: ToolHelperTranslation;
}

export interface CanvasMouseEventButtons {
	left: boolean;
	middle: boolean;
	right: boolean;
}

export interface CanvasMouseEvent {
	buttons: CanvasMouseEventButtons;
	viewPortPoint: Point;
	projectFilePoint: Point;
}

export abstract class Tool<TToolState> {
	public abstract readonly name: ToolName;
	public abstract readonly iconClassName: string;
	public abstract readonly displayName: string;

	public mouseDown(
		helper: ToolHelper,
		event: CanvasMouseEvent
	): void {
		// Just to remove compiler warnings about unused variables
		helper = helper;
		event = event;
	}

	public mouseMove(
		helper: ToolHelper,
		event: CanvasMouseEvent
	): void {
		// Just to remove compiler warnings about unused variables
		helper = helper;
		event = event;
	}

	public mouseUp(
		helper: ToolHelper,
		event: CanvasMouseEvent
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
