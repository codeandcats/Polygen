import { ApplicationState } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { PolygenDocument } from '../../../shared/models/polygenDocument';
import { Size } from '../../../shared/models/size';
import { defineAction } from '../../reduxWithLessSux/action';

interface OpenNewProjectFilePayload {
  dimensions: Size;
}

export const openNewProjectFile = defineAction(
  'openNewProjectFile',
  (state: ApplicationState, payload: OpenNewProjectFilePayload) => {
    const document: PolygenDocument = {
      images: [],
      layers: [
        {
          image: {
            topLeft: { x: -1, y: -1 },
            bottomRight: { x: 1, y: 1 },
            imageId: undefined,
          },
          isVisible: true,
          name: 'Layer 1',
          points: [],
          polygons: [],
        },
      ],
      dimensions: payload.dimensions,
    };
    const editor: Editor = {
      document,
      fileName: undefined,
      hasUnsavedChanges: true,
      isFramesPerSecondVisible: false,
      mode: 'edit',
      selectedLayerIndex: 0,
      selectedPointIndices: [],
      selectedToolName: undefined,
      viewPort: {
        pan: {
          x: 0,
          y: 0,
        },
        zoom: 1,
      },
    };
    const editors = state.editors.concat(editor);
    const activeEditorIndex = editors.length - 1;

    return {
      ...state,
      dialogs: {
        ...state.dialogs,
      },
      editors,
      activeEditorIndex,
    };
  }
).getDispatcher();
