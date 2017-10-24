import { Tool, ToolName } from './common';

interface SelectionToolState {
}

export class SelectionTool extends Tool<SelectionToolState> {
	public readonly name: ToolName = 'selection';
	public readonly iconClassName = 'fa-square-o';
	public readonly displayName = 'Selection Tool';
}
