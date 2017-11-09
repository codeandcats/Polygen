import { ApplicationState } from '../../../../../shared/models/applicationState';
import { Nullable } from '../../../../../shared/models/nullable';
import { defineAction } from '../../../../reduxWithLessSux/action';

interface SetLayerSettingsPayload {
	layerIndex: number;
	opacityThreshold: Nullable<number>;
	transparencyThreshold: Nullable<number>;
}

export const setLayerSettings = defineAction(
	'setLayerSettings', (state: ApplicationState, payload: SetLayerSettingsPayload) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				return {
					...editor,
					document: {
						...editor.document,
						layers: editor.document.layers.map((layer, layerIndex) => {
							if (layerIndex === payload.layerIndex) {
								layer = {
									...layer,
									opacityThreshold: payload.opacityThreshold,
									transparencyThreshold: payload.transparencyThreshold
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
