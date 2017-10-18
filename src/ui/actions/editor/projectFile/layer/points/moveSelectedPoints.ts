import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Point } from '../../../../../../shared/models/point';
import { defineAction } from '../../../../../reduxWithLessSux/action';
import store from '../../../../../store';

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
								return {
									...layer,
									points: layer.points.map((point, pointIndex) => {
										if (editor.selectedPointIndices.indexOf(pointIndex) > -1) {
											return {
												x: point.x + payload.moveBy.x,
												y: point.y + payload.moveBy.y
											};
										}
										return point;
									})
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
).getDispatcher(store);
