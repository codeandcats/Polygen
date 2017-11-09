import { ApplicationState } from '../../../shared/models/applicationState';
import { Dialogs, NativeDialogType } from '../../../shared/models/dialogs';
import { defineAction } from '../../reduxWithLessSux/action';

export const hideNativeDialog = defineAction(
	'hideNativeDialog', (state: ApplicationState) => {
		const dialogs: Dialogs = {
			...state.dialogs,
			native: undefined
		};
		const result: ApplicationState = {
			...state,
			dialogs
		};
		return result;
	}
).getDispatcher();
