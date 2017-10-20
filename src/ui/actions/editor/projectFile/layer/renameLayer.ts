import { ApplicationState } from '../../../../../shared/models/applicationState';
import { defineAction } from '../../../../reduxWithLessSux/action';

interface RenameLayerPayload {
	layerIndex: number;
	layerName: string;
}

export const renameLayer = defineAction(
	'renameLayer', (state: ApplicationState, payload: RenameLayerPayload) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				const projectFile = editor.projectFile;
				const layers = projectFile.layers.map((layer, layerIndex) => {
					if (layerIndex === payload.layerIndex) {
						layer = {
							...layer,
							name: payload.layerName
						};
					}
					return layer;
				});

				return {
					...editor,
					projectFile: {
						...projectFile,
						layers
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
