import { ProjectFile } from './projectFile';
import { ViewPort } from './viewPort';

export interface Editor {
	fileName: string | undefined;
	hasUnsavedChanges: boolean;
	projectFile: ProjectFile;
	selectedLayerIndex: number;
	selectedPointIndices: number[];
	viewPort: ViewPort;
}
