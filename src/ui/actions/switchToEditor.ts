import { ApplicationState } from '../../shared/models/applicationState';
import { defineAction } from '../reduxWithLessSux/action';

export interface SwitchToEditorPayload {
	editorIndex: number;
}

export const switchToEditor = defineAction(
	'switchToEditor', (state: ApplicationState, payload: SwitchToEditorPayload) => {
		return {
			...state,
			activeEditorIndex: payload.editorIndex
		};
	}
).getDispatcher();
