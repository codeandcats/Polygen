import { moveElement } from '../../../shared/lang/arrays';
import { ApplicationState } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { Layer } from '../../../shared/models/layer';
import { Point } from '../../../shared/models/point';
import { ProjectFile } from '../../../shared/models/projectFile';
import { defineAction } from '../../reduxWithLessSux/action';
import store from '../../store';

interface OpenExistingProjectFilePayload {
	fileName: string;
	projectFile: ProjectFile;
}

function indexOfEditorByFileName(editors: Editor[], fileName: string): number {
	const editorIndex = editors.reduce((result, editor, index) => {
		if (result === -1 && editor.fileName === fileName) {
			result = index;
		}
		return result;
	}, -1);

	return editorIndex;
}

export const openExistingProjectFile = defineAction(
	'openExistingProjectFile',
	(state: ApplicationState, payload: OpenExistingProjectFilePayload) => {
		let editorIndex = indexOfEditorByFileName(state.editors, payload.fileName);

		let editors: Editor[];

		if (editorIndex !== -1) {
			editors = state.editors;
		} else {
			const editor: Editor = {
				fileName: payload.fileName,
				hasUnsavedChanges: false,
				projectFile: payload.projectFile,
				selectedLayerIndex: 0,
				selectedPointIndices: [],
				viewPort: {
					zoom: 1,
					pan: {
						x: 0,
						y: 0
					}
				}
			};
			editors = [...state.editors].concat(editor);
			editorIndex = editors.length - 1;
		}

		let recentFileNames = [...state.recentFileNames];
		const recentFileNameIndex = recentFileNames.indexOf(payload.fileName);
		if (recentFileNameIndex === -1) {
			recentFileNames.push(payload.fileName);
		} else {
			recentFileNames = moveElement(recentFileNames, recentFileNameIndex, 0);
		}

		return {
			...state,
			activeEditorIndex: editorIndex,
			editors,
			recentFileNames
		};
	}
).getDispatcher(store);
