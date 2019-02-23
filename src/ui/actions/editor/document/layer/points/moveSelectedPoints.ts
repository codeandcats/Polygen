import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Point } from '../../../../../../shared/models/point';
import { recalculatePolygons } from '../../../../../../shared/utils/geometry';
import { ImageCache } from '../../../../../models/imageCache';
import { defineAction } from '../../../../../reduxWithLessSux/action';
import { getAbsoluteDocumentPoint, recalculatePolygonColours } from '../../../../../utils/graphics';

interface MoveSelectedPointsPayload {
  imageCache: ImageCache;
  moveBy: Point;
}

export const moveSelectedPoints = defineAction(
  'moveSelectedPoints', (state: ApplicationState, payload: MoveSelectedPointsPayload) => {
    const editors = state.editors.map((editor, editorIndex) => {
      if (editorIndex === state.activeEditorIndex) {
        const document = editor.document;
        return {
          ...editor,
          document: {
            ...document,
            layers: document.layers.map((layer, layerIndex) => {
              if (layerIndex === editor.selectedLayerIndex) {
                const points = layer.points.map((point, pointIndex) => {
                  if (editor.selectedPointIndices.indexOf(pointIndex) > -1) {
                    return {
                      x: point.x + payload.moveBy.x,
                      y: point.y + payload.moveBy.y
                    };
                  }
                  return point;
                });

                let polygons = recalculatePolygons(points);

                polygons = recalculatePolygonColours({
                  document,
                  imageCache: payload.imageCache,
                  layer,
                  points,
                  polygons
                });

                return {
                  ...layer,
                  points,
                  polygons
                };
              }
              return layer;
            })
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
