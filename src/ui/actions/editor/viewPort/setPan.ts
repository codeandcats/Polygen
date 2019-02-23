import { ApplicationState } from '../../../../shared/models/applicationState';
import { Editor } from '../../../../shared/models/editor';
import { Point } from '../../../../shared/models/point';
import { defineAction } from '../../../reduxWithLessSux/action';

interface SetPanPayload {
  pan: Point;
}

export const setPan = defineAction(
  'setPan',
  (state: ApplicationState, payload: SetPanPayload) => {
    const editors = state.editors.map((editor, index) => {
      if (index === state.activeEditorIndex) {
        const { pan } = payload;
        editor = {
          ...editor,
          viewPort: {
            ...editor.viewPort,
            pan
          }
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
