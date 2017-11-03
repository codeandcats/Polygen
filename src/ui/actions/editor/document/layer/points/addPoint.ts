import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Point } from '../../../../../../shared/models/point';
import { recalculatePolygons } from '../../../../../../shared/utils/geometry';
import { ImageCache } from '../../../../../models/imageCache';
import { defineAction } from '../../../../../reduxWithLessSux/action';
import { getAbsoluteDocumentPoint, recalculatePolygonColours } from '../../../../../utils/graphics';

interface AddPointActionPayload {
	point: Point;
	imageCache: ImageCache;
}

export const addPoint = defineAction(
	'addPoint', (state: ApplicationState, payload: AddPointActionPayload) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				const document = editor.document;
				const points = document.layers[editor.selectedLayerIndex].points.concat({
					...payload.point
				});
				const selectedPointIndices = [points.length - 1];
				const layers = document.layers.map((layer, layerIndex) => {
					if (layerIndex === editor.selectedLayerIndex) {
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
				});

				return {
					...editor,
					document: {
						...document,
						layers
					},
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
