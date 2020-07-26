import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Point } from '../../../../../../shared/models/point';
import { recalculatePolygons } from '../../../../../../shared/utils/geometry';
import { ImageCache } from '../../../../../models/imageCache';
import { defineAction } from '../../../../../reduxWithLessSux/action';
import {
  getAbsoluteDocumentPoint,
  recalculatePolygonColours,
} from '../../../../../utils/graphics';

interface RemoveSelectionPayload {
  imageCache: ImageCache;
}

export const removeSelection = defineAction(
  'removeSelection',
  (state: ApplicationState, payload: RemoveSelectionPayload) => {
    const editors = state.editors.map((editor, editorIndex) => {
      if (editorIndex === state.activeEditorIndex) {
        const selectedPointIndices = editor.selectedPointIndices;
        const document = editor.document;
        return {
          ...editor,
          document: {
            ...document,
            layers: document.layers.map((layer, layerIndex) => {
              if (layerIndex === editor.selectedLayerIndex) {
                const points = layer.points.filter((_, pointIndex) => {
                  return editor.selectedPointIndices.indexOf(pointIndex) === -1;
                });
                let polygons = recalculatePolygons(points);

                polygons = recalculatePolygonColours({
                  document,
                  imageCache: payload.imageCache,
                  layer,
                  points,
                  polygons,
                });

                return {
                  ...layer,
                  points,
                  polygons,
                };
              }
              return layer;
            }),
          },
          selectedPointIndices: [],
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
