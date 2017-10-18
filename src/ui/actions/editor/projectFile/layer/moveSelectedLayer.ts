import { moveElement } from '../../../../../shared/lang/arrays';
import { ApplicationState } from '../../../../../shared/models/applicationState';
import { Point } from '../../../../../shared/models/point';
import { defineAction } from '../../../../reduxWithLessSux/action';
import store from '../../../../store';

interface MoveSelectedLayerPayload {
	moveBy: number;
}

export const moveSelectedLayer = defineAction(
	'moveSelectedLayer', (state: ApplicationState, payload: MoveSelectedLayerPayload) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				const projectFile = editor.projectFile;
				let layers = [...projectFile.layers];
				layers = moveElement(layers, editor.selectedLayerIndex, editor.selectedLayerIndex + payload.moveBy);

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
).getDispatcher(store);
