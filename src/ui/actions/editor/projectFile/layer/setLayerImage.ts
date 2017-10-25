import { ApplicationState } from '../../../../../shared/models/applicationState';
import { ImageSource } from '../../../../../shared/models/imageSource';
import { Nullable } from '../../../../../shared/models/nullable';
import { defineAction } from '../../../../reduxWithLessSux/action';

interface SetLayerImagePayload {
	layerIndex: number;
	imageSource: Nullable<ImageSource>;
}

export const setLayerImage = defineAction(
	'setLayerImage', (state: ApplicationState, payload: SetLayerImagePayload) => {
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
									imageSource: payload.imageSource
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
