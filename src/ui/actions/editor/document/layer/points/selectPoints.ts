import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { defineAction } from '../../../../../reduxWithLessSux/action';

interface SelectPointsPayload {
  pointIndices: number[];
}

export const selectPoints = defineAction(
  'selectPoints', (state: ApplicationState, payload: SelectPointsPayload) => {
    const editors = state.editors.map((editor, editorIndex) => {
      if (editorIndex === state.activeEditorIndex) {
        const selectedPointIndices = [...payload.pointIndices];
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
