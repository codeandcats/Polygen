import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { defineAction } from '../../../../../reduxWithLessSux/action';

export const selectAllPoints = defineAction(
  'selectAllPoints', (state: ApplicationState) => {
    const editors = state.editors.map((editor, editorIndex) => {
      if (editorIndex === state.activeEditorIndex) {
        const layer = editor.document.layers[editor.selectedLayerIndex];
        const selectedPointIndices = layer.points.map((_, index) => index);
        return {
          ...editor,
          selectedPointIndices
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
