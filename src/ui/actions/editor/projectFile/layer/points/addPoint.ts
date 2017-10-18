import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Point } from '../../../../../../shared/models/point';
import { defineAction } from '../../../../../reduxWithLessSux/action';
import store from '../../../../../store';

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
								return {
									...layer,
									points: layer.points.concat({
										...payload.point
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