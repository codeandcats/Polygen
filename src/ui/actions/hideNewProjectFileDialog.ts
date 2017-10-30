import { ApplicationState } from '../../shared/models/applicationState';
import { defineAction } from '../reduxWithLessSux/action';

export const hideNewProjectFileDialog = defineAction(
	'hideNewProjectFileDialog', (state: ApplicationState) => {
		const newProjectFile = state.dialogs.newProjectFile;
		return {
			...state,
			dialogs: {
				...state.dialogs,
				newProjectFile: {
					...state.dialogs.newProjectFile,
					isVisible: false
				}
			}
		};
	}
).getDispatcher();
