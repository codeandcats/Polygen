import { ApplicationState } from '../../../../../shared/models/applicationState';
import { defineAction } from '../../../../reduxWithLessSux/action';
import { purgeUnusedImages } from '../purgeUnusedImages';

interface RemoveLayerPayload {
  layerIndex: number;
}

export const removeLayer = defineAction(
  'removeLayer',
  (state: ApplicationState, payload: RemoveLayerPayload) => {
    const editors = state.editors.map((editor, editorIndex) => {
      if (editorIndex === state.activeEditorIndex) {
        let { selectedLayerIndex } = editor;
        const document = editor.document;
        let layers = [...document.layers];
        if (layers.length > 1) {
          layers = layers.filter((_, index) => index !== payload.layerIndex);
        }
        selectedLayerIndex = Math.min(
          layers.length - 1,
          Math.max(0, selectedLayerIndex)
        );

        return {
          ...editor,
          document: purgeUnusedImages({
            ...document,
            layers,
          }),
          selectedLayerIndex,
        };
      }
      return editor;
    });

    return {
      ...state,
      editors,
    };
  }
).getDispatcher();
