import { ApplicationState } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { ToolName } from '../../models/tools/common';
import { defineAction } from '../../reduxWithLessSux/action';

interface SelectToolPayload {
	toolName: ToolName | undefined;
}

export const selectTool = defineAction(
	'selectTool',
	(state: ApplicationState, payload: SelectToolPayload) => {
		const editors = state.editors.map((editor, index) => {
			if (index === state.activeEditorIndex) {
				editor = {
					...editor,
					selectedToolName: payload.toolName
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
