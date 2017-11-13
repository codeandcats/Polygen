import { PolygenDocument } from './polygenDocument';
import { ViewPort } from './viewPort';
import { ToolName } from '../../ui/models/tools/common';

export interface Editor {
	document: PolygenDocument;
	fileName: string | undefined;
	hasUnsavedChanges: boolean;
	selectedLayerIndex: number;
	selectedPointIndices: number[];
	selectedToolName: ToolName | undefined;
	viewPort: ViewPort;
}
