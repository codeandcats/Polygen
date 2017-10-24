import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Point } from '../../../../../../shared/models/point';
import { recalculatePolygons } from '../../../../../../shared/utils/geometry';
import { defineAction } from '../../../../../reduxWithLessSux/action';

interface MoveSelectedPointsPayload {
	moveBy: Point;
}

export const moveSelectedPoints = defineAction(
	'moveSelectedPoints', (state: ApplicationState, payload: MoveSelectedPointsPayload) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				const projectFile = editor.projectFile;
				return {
					...editor,
					projectFile: {
						...projectFile,
						layers: projectFile.layers.map((layer, layerIndex) => {
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
