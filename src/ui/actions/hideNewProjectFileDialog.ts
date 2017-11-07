import { ApplicationState } from '../../shared/models/applicationState';
import { Dialogs } from '../../shared/models/dialogs';
import { defineAction } from '../reduxWithLessSux/action';

export const hideNewProjectFileDialog = defineAction(
	'hideNewProjectFileDialog', (state: ApplicationState) => {
		const newProjectFile = state.dialogs.newProjectFile;
		const dialogs: Dialogs = {
			...state.dialogs,
			newProjectFile: {
				...state.dialogs.newProjectFile,
				isVisible: false
			},
			visibleWebDialogCount: Math.max(0, state.dialogs.visibleWebDialogCount - 1)
		};
		return {
			...state,
			dialogs
		};
	}
).getDispatcher();
