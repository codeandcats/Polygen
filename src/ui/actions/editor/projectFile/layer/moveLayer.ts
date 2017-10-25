import { ApplicationState } from '../../../../../shared/models/applicationState';
import { Point } from '../../../../../shared/models/point';
import { moveElement } from '../../../../../shared/utils/arrays';
import { defineAction } from '../../../../reduxWithLessSux/action';

interface MoveLayerPayload {
	layerIndex: number;
	toIndex: number;
}

export const moveLayer = defineAction(
	'moveLayer', (state: ApplicationState, payload: MoveLayerPayload) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				const projectFile = editor.projectFile;
				let layers = [...projectFile.layers];

				if (payload.toIndex < 0 || payload.toIndex >= layers.length) {
					return editor;
				}

				layers = moveElement(layers, payload.layerIndex, payload.toIndex);
				const selectedLayerIndex = (
					editor.selectedLayerIndex === payload.layerIndex ?
					payload.toIndex :
					editor.selectedLayerIndex
				);

				return {
					...editor,
					projectFile: {
						...projectFile,
						layers
					},
					selectedLayerIndex
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
