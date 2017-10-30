import { ApplicationState } from '../../shared/models/applicationState';
import { defineAction } from '../reduxWithLessSux/action';

export const showNewProjectFileDialog = defineAction(
	'showNewProjectFileDialog', (state: ApplicationState) => {
		const newProjectFile = state.dialogs.newProjectFile;
		return {
			...state,
			dialogs: {
				...state.dialogs,
				newProjectFile: {
					...state.dialogs.newProjectFile,
					isVisible: true
				}
			}
		};
	}
).getDispatcher();
