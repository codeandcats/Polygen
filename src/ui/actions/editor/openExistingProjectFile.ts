import { ApplicationState, MAX_RECENT_FILE_NAME_COUNT } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { Layer } from '../../../shared/models/layer';
import { Point } from '../../../shared/models/point';
import { PolygenDocument } from '../../../shared/models/polygenDocument';
import { moveElement } from '../../../shared/utils/arrays';
import { makeMostRecent } from '../../../shared/utils/recentItemList';
import { defineAction } from '../../reduxWithLessSux/action';

interface OpenExistingProjectFilePayload {
	fileName: string;
	document: PolygenDocument;
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
				document: payload.document,
				fileName: payload.fileName,
				hasUnsavedChanges: false,
				mode: 'edit',
				selectedLayerIndex: 0,
				selectedPointIndices: [],
				selectedToolName: undefined,
				viewPort: {
					isFramesPerSecondVisible: false,
					pan: {
						x: 0,
						y: 0
					},
					zoom: 1
				}
			};
			editors = [...state.editors].concat(editor);
			editorIndex = editors.length - 1;
		}

		const recentFileNames = makeMostRecent(state.recentFileNames || [], payload.fileName, {
			maxListSize: MAX_RECENT_FILE_NAME_COUNT
		});

		return {
			...state,
			activeEditorIndex: editorIndex,
			editors,
			recentFileNames
		};
	}
).getDispatcher();
