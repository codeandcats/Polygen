import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Point } from '../../../../../../shared/models/point';
import { recalculatePolygons } from '../../../../../../shared/utils/geometry';
import { defineAction } from '../../../../../reduxWithLessSux/action';

interface AddPointActionPayload {
	editorIndex: number;
	layerIndex: number;
	point: Point;
}

export const addPoint = defineAction(
	'addPoint', (state: ApplicationState, payload: AddPointActionPayload) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === payload.editorIndex) {
				const projectFile = editor.projectFile;
				return {
					...editor,
					projectFile: {
						...projectFile,
						layers: projectFile.layers.map((layer, layerIndex) => {
							if (layerIndex === payload.layerIndex) {
								const points = layer.points.concat({
									...payload.point
								});
								const polygons = recalculatePolygons(points);
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
