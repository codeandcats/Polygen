import { ApplicationState } from '../../shared/models/applicationState';
import { Dialogs } from '../../shared/models/dialogs';
import { defineAction } from '../reduxWithLessSux/action';

export const nativeDialogDidHide = defineAction(
	'nativeDialogDidHide', (state: ApplicationState) => {
		const dialogs: Dialogs = {
			...state.dialogs,
			visibleNativeDialogCount: Math.max(0, state.dialogs.visibleNativeDialogCount - 1)
		};
		const result: ApplicationState = {
			...state,
			dialogs
		};
		return result;
	}
).getDispatcher();
