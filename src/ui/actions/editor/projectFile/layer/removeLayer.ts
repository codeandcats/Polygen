import { ApplicationState } from '../../../../../shared/models/applicationState';
import { defineAction } from '../../../../reduxWithLessSux/action';

interface RemoveLayerPayload {
	layerIndex: number;
}

export const removeLayer = defineAction(
	'removeLayer', (state: ApplicationState, payload: RemoveLayerPayload) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				let { selectedLayerIndex } = editor;
				const projectFile = editor.projectFile;
				let layers = [...projectFile.layers];
				if (layers.length > 1) {
					layers = layers.filter((_, index) => index !== payload.layerIndex);
				}
				selectedLayerIndex = Math.min(layers.length - 1, Math.max(0, selectedLayerIndex));

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
