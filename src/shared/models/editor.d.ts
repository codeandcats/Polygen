import { PolygenDocument } from './polygenDocument';
import { ViewPort } from './viewPort';
import { ToolName } from '../../ui/models/tools/common';
import { EditorMode } from './editorMode';

export interface Editor {
	document: PolygenDocument;
	fileName: string | undefined;
	hasUnsavedChanges: boolean;
	mode: EditorMode;
	selectedLayerIndex: number;
	selectedPointIndices: number[];
	selectedToolName: ToolName | undefined;
	viewPort: ViewPort;
}
