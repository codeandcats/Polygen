import { ApplicationState, MAX_RECENT_FILE_NAME_COUNT } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { ProjectFile } from '../../../shared/models/projectFile';
import { Size } from '../../../shared/models/size';
import { makeMostRecent } from '../../../shared/utils/recentItemList';
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

		const recentFileNames = makeMostRecent(state.recentFileNames || [], payload.fileName, {
			maxListSize: MAX_RECENT_FILE_NAME_COUNT
		});

		return {
			...state,
			editors,
			recentFileNames
		};
	}
).getDispatcher();
