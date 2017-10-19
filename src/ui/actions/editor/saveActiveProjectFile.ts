import { ApplicationState } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { ProjectFile } from '../../../shared/models/projectFile';
import { Size } from '../../../shared/models/size';
import { defineAction } from '../../reduxWithLessSux/action';

interface SaveActiveProjectFilePayload {
	fileName: string;
}

export const saveActiveProjectFile = defineAction(
	'saveProjectFile',
	(state: ApplicationState, payload: SaveActiveProjectFilePayload) => {
		const editors = state.editors.map((editor, index) => {
			if (index === state.activeEditorIndex) {
				editor = {
					...editor,
					fileName: payload.fileName,
					hasUnsavedChanges: false
				};
			}
			return editor;
		});
		return {
			...state,
			editors
		};
	}
).getDispatcher();
