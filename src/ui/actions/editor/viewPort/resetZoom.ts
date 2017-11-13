import { ApplicationState } from '../../../../shared/models/applicationState';
import { defineAction } from '../../../reduxWithLessSux/action';

export const resetZoom = defineAction(
	'resetZoom',
	(state: ApplicationState) => {
		const editors = state.editors.map((editor, index) => {
			if (index === state.activeEditorIndex) {
				const zoom = 1;
				const viewPort = {
					...editor.viewPort,
					zoom
				};
				editor = {
					...editor,
					viewPort
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
