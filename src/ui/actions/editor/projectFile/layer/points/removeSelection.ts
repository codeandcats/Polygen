import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Point } from '../../../../../../shared/models/point';
import { recalculatePolygons } from '../../../../../../shared/utils/geometry';
import { defineAction } from '../../../../../reduxWithLessSux/action';

export const removeSelection = defineAction(
	'removeSelection', (state: ApplicationState) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				const selectedPointIndices = editor.selectedPointIndices;
				const projectFile = editor.projectFile;
				return {
					...editor,
					projectFile: {
						...projectFile,
						layers: projectFile.layers.map((layer, layerIndex) => {
							if (layerIndex === editor.selectedLayerIndex) {
								const points = layer.points.filter((_, pointIndex) => {
									return editor.selectedPointIndices.indexOf(pointIndex) === -1;
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
					},
					selectedPointIndices: []
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
