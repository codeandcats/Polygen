import { ApplicationState } from '../../shared/models/applicationState';
import { Settings } from '../../shared/models/settings';
import { defineAction } from '../reduxWithLessSux/action';

export interface LoadSettingsPayload {
  settings: Settings;
}

export const loadSettings = defineAction(
  'loadSettings', (state: ApplicationState, payload: LoadSettingsPayload) => {
    return {
      ...state,
      recentFileNames: payload.settings.recentFileNames
    };
  }
).getDispatcher();
