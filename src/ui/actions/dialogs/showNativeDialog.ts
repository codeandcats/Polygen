import { ApplicationState } from '../../../shared/models/applicationState';
import { Dialogs, NativeDialogType } from '../../../shared/models/dialogs';
import { defineAction } from '../../reduxWithLessSux/action';

interface ShowNativeDialogPayload {
  type: NativeDialogType;
}

export const showNativeDialog = defineAction(
  'showNativeDialog', (state: ApplicationState, payload: ShowNativeDialogPayload) => {
    const dialogs: Dialogs = {
      ...state.dialogs,
      native: payload.type
    };
    const result: ApplicationState = {
      ...state,
      dialogs
    };
    return result;
  }
).getDispatcher();
