import { ProjectFile } from './projectFile';
import { ViewPort } from './viewPort';
import { ToolName } from '../../ui/models/tools/common';

export interface Editor {
	fileName: string | undefined;
	hasUnsavedChanges: boolean;
	projectFile: ProjectFile;
	selectedLayerIndex: number;
	selectedPointIndices: number[];
	selectedToolName: ToolName | undefined;
	viewPort: ViewPort;
}
