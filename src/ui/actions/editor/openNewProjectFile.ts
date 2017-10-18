import { ApplicationState } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { ProjectFile } from '../../../shared/models/projectFile';
import { Size } from '../../../shared/models/size';
import { defineAction } from '../../reduxWithLessSux/action';
import store from '../../store';

interface OpenNewProjectFilePayload {
	size: Size;
}

export const openNewProjectFile = defineAction(
	'openNewProjectFile',
	(state: ApplicationState, payload: OpenNewProjectFilePayload) => {
		const projectFile: ProjectFile = {
			layers: [
				{
					points: []
				}
			],
			size: payload.size
		};
		const editor: Editor = {
			fileName: undefined,
			hasUnsavedChanges: true,
			projectFile,
			selectedLayerIndex: 0,
			selectedPointIndices: [],
			viewPort: {
				zoom: 1,
				pan: {
					x: 0,
					y: 0
				}
			}
		};
		const editors = state.editors.concat(editor);
		const activeEditorIndex = editors.length - 1;

		return {
			...state,
			editors,
			activeEditorIndex
		};
	}
).getDispatcher(store);
