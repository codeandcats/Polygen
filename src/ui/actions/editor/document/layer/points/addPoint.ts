import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Point } from '../../../../../../shared/models/point';
import { recalculatePolygons } from '../../../../../../shared/utils/geometry';
import { defineAction } from '../../../../../reduxWithLessSux/action';

interface AddPointActionPayload {
	point: Point;
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
				return {
					...editor,
					document: {
						...document,
						layers: document.layers.map((layer, layerIndex) => {
							if (layerIndex === editor.selectedLayerIndex) {
								const polygons = recalculatePolygons(points);
								return {
									...layer,
									points,
									polygons
								};
							}
							return layer;
						})
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