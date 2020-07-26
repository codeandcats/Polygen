import { ApplicationState } from '../../../shared/models/applicationState';
import { Dialogs, WebDialog } from '../../../shared/models/dialogs';
import { defineAction } from '../../reduxWithLessSux/action';

interface ShowWebDialogPayload {
  dialog: WebDialog;
}

export const showWebDialog = defineAction(
  'showWebDialog',
  (state: ApplicationState, payload: ShowWebDialogPayload) => {
    const dialogs: Dialogs = {
      ...state.dialogs,
      web: payload.dialog,
    };
    const result: ApplicationState = {
      ...state,
      dialogs,
    };
    return result;
  }
).getDispatcher();
