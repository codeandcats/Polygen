import { ApplicationState } from '../../../../../shared/models/applicationState';
import { defineAction } from '../../../../reduxWithLessSux/action';

interface SelectLayerPayload {
	layerIndex: number;
}

export const selectLayer = defineAction(
	'selectedLayer', (state: ApplicationState, payload: SelectLayerPayload) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				const selectedLayerIndex = payload.layerIndex;
				return {
					...editor,
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
