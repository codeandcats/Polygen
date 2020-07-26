import { ApplicationState } from '../../../../../shared/models/applicationState';
import { defineAction } from '../../../../reduxWithLessSux/action';
import * as clone from 'clone';

interface DuplicateLayerPayload {
  layerIndex: number;
}

export const duplicateLayer = defineAction(
  'duplicateLayer',
  (state: ApplicationState, { layerIndex }: DuplicateLayerPayload) => {
    const editors = state.editors.map((editor, editorIndex) => {
      if (editorIndex === state.activeEditorIndex) {
        const document = editor.document;

        const existingLayer = document.layers[layerIndex];

        if (!existingLayer) {
          return state;
        }

        const newLayer = clone(existingLayer, false);

        const layers = [...document.layers];
        layers.splice(layerIndex + 1, 0, newLayer);

        return {
          ...editor,
          document: {
            ...document,
            layers,
          },
          selectedLayerIndex: layerIndex + 1,
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
