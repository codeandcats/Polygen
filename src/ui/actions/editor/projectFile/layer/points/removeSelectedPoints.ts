import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Point } from '../../../../../../shared/models/point';
import { defineAction } from '../../../../../reduxWithLessSux/action';
import store from '../../../../../store';

export const removeSelectedPoints = defineAction(
	'removeSelectedPoints', (state: ApplicationState) => {
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
								return {
									...layer,
									points: layer.points.filter((_, pointIndex) => {
										return editor.selectedPointIndices.indexOf(pointIndex) === -1;
									})
								};
							}
							return layer;
						}),
						selectedPointIndices: []
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
).getDispatcher(store);
