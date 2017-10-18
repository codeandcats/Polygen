import { moveElement } from '../../../../../shared/lang/arrays';
import { ApplicationState } from '../../../../../shared/models/applicationState';
import { Point } from '../../../../../shared/models/point';
import { defineAction } from '../../../../reduxWithLessSux/action';
import store from '../../../../store';

export const movePoint = defineAction(
	'addLayer', (state: ApplicationState) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				const projectFile = editor.projectFile;
				let layers = [...projectFile.layers];
				layers = moveElement(layers, editor.selectedLayerIndex, editor.selectedLayerIndex);

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
