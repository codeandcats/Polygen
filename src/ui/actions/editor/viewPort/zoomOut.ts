import { ApplicationState } from '../../../../shared/models/applicationState';
import { defineAction } from '../../../reduxWithLessSux/action';
import { ZOOM_INCREMENT } from './zoom';

export const zoomOut = defineAction(
  'zoomOut',
  (state: ApplicationState) => {
    const editors = state.editors.map((editor, index) => {
      if (index === state.activeEditorIndex) {
        const zoom = editor.viewPort.zoom - ZOOM_INCREMENT;
        const viewPort = {
          ...editor.viewPort,
          zoom
        };
        editor = {
          ...editor,
          viewPort
        };
      }
      return editor;
    });
    return {
      ...state,
      editors
    };
  }
).getDispatcher();
