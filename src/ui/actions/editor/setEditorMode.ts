import { ApplicationState } from '../../../shared/models/applicationState';
import { EditorMode } from '../../../shared/models/editorMode';
import { defineAction } from '../../reduxWithLessSux/action';

interface SetEditorModePayload {
	mode: EditorMode;
}

export const setEditorMode = defineAction(
	'setEditorMode',
	(state: ApplicationState, payload: SetEditorModePayload) => {
		const { mode } = payload;
		const editors = state.editors.map((editor, index) => {
			if (index === state.activeEditorIndex) {
				editor = {
					...editor,
					mode
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
