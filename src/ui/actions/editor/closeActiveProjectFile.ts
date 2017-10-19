import { ApplicationState } from '../../../shared/models/applicationState';
import { defineAction } from '../../reduxWithLessSux/action';

export const closeActiveProjectFile = defineAction(
	'closeActiveProjectFile', (state: ApplicationState) => {
		const editors = state.editors.filter((_, editorIndex) => editorIndex !== state.activeEditorIndex);
		return {
			...state,
			editors
		};
	}
).getDispatcher();
