import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { defineAction } from '../../../../../reduxWithLessSux/action';

export const deselectAllPoints = defineAction(
	'deselectAllPoints', (state: ApplicationState) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				return {
					...editor,
					selectedPointIndices: []
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
