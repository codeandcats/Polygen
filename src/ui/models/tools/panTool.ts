import { Tool, ToolName } from './common';

interface PanToolState {
}

export class PanTool extends Tool<PanToolState> {
	public readonly name: ToolName = 'pan';
	public readonly iconClassName = 'fa-hand-paper-o';
	public readonly displayName = 'Pan';
}
