import { ApplicationState } from '../../../shared/models/applicationState';
import { Dialogs, WebDialog } from '../../../shared/models/dialogs';
import { defineAction } from '../../reduxWithLessSux/action';

type UpdateWebDialogFieldPayload<T extends WebDialog> = Partial<T>;

export const updateWebDialogFields = defineAction(
  'updateWebDialogFields',
  (
    state: ApplicationState,
    payload: UpdateWebDialogFieldPayload<WebDialog>
  ) => {
    const web: any = state.dialogs.web || {};
    for (const key of Object.getOwnPropertyNames(payload)) {
      web[key] = (payload as any)[key];
    }
    const dialogs: Dialogs = {
      ...state.dialogs,
      web,
    };
    const result: ApplicationState = {
      ...state,
      dialogs,
    };
    return result;
  }
).getDispatcher();
