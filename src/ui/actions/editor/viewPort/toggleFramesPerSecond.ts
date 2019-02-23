import { ApplicationState } from '../../../../shared/models/applicationState';
import { Editor } from '../../../../shared/models/editor';
import { Point } from '../../../../shared/models/point';
import { defineAction } from '../../../reduxWithLessSux/action';

export const toggleFramesPerSecond = defineAction(
  'toggleFramesPerSecond',
  (state: ApplicationState) => {
    const editors = state.editors.map((editor, index) => {
      if (index === state.activeEditorIndex) {
        editor = {
          ...editor,
          isFramesPerSecondVisible: !editor.isFramesPerSecondVisible
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
