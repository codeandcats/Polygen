import { ApplicationState } from '../../../shared/models/applicationState';
import { defineAction } from '../../reduxWithLessSux/action';
import store from '../../store';

export const closeActiveProjectFile = defineAction(
	'closeActiveProjectFile', (state: ApplicationState) => {
		const editors = state.editors.filter((_, editorIndex) => editorIndex !== state.activeEditorIndex);
		return {
			...state,
			editors
		};
	}
).getDispatcher(store);
