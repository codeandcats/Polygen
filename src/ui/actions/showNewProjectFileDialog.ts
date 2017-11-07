import { ApplicationState } from '../../shared/models/applicationState';
import { Dialogs } from '../../shared/models/dialogs';
import { defineAction } from '../reduxWithLessSux/action';

export const showNewProjectFileDialog = defineAction(
	'showNewProjectFileDialog', (state: ApplicationState) => {
		const newProjectFile = state.dialogs.newProjectFile;
		const dialogs: Dialogs = {
			...state.dialogs,
			newProjectFile: {
				...state.dialogs.newProjectFile,
				isVisible: true
			},
			visibleWebDialogCount: state.dialogs.visibleWebDialogCount + 1
		};
		return {
			...state,
			dialogs
		};
	}
).getDispatcher();
