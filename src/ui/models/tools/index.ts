import { Tool } from './common';
import { ImageBoundsTool } from './imageBoundsTool';
import { PanTool } from './panTool';
import { PointTool } from './pointTool';
import { SelectionTool } from './selectionTool';

export const TOOL_BY_NAME: { [toolName: string]: Tool<any> } = {
	imageBounds: new ImageBoundsTool(),
	pan: new PanTool(),
	point: new PointTool(),
	selection: new SelectionTool()
};
