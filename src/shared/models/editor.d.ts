import { PolygenDocument } from './polygenDocument';
import { ViewPort } from './viewPort';
import { ToolName } from '../../ui/models/tools/common';

export interface Editor {
	fileName: string | undefined;
	hasUnsavedChanges: boolean;
	document: PolygenDocument;
	selectedLayerIndex: number;
	selectedPointIndices: number[];
	selectedToolName: ToolName | undefined;
	viewPort: ViewPort;
}
