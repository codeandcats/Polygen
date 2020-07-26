import { ApplicationState } from '../../../shared/models/applicationState';
import { Dialogs, WebDialog } from '../../../shared/models/dialogs';
import { defineAction } from '../../reduxWithLessSux/action';

export const hideWebDialog = defineAction(
  'hideWebDialog',
  (state: ApplicationState) => {
    const dialogs: Dialogs = {
      ...state.dialogs,
      web: undefined,
    };
    const result: ApplicationState = {
      ...state,
      dialogs,
    };
    return result;
  }
).getDispatcher();
