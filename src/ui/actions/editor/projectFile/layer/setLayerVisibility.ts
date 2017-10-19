import { ApplicationState } from '../../../../../shared/models/applicationState';
import { defineAction } from '../../../../reduxWithLessSux/action';

interface SetLayerVisibilityPayload {
	layerIndex: number;
	isVisible: boolean;
}

export const setLayerVisibility = defineAction(
	'setLayerVisibility', (state: ApplicationState, payload: SetLayerVisibilityPayload) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				return {
					...editor,
					projectFile: {
						...editor.projectFile,
						layers: editor.projectFile.layers.map((layer, layerIndex) => {
							if (layerIndex === payload.layerIndex) {
								layer = {
									...layer,
									isVisible: payload.isVisible
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
