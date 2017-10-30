import { ApplicationState } from '../../../shared/models/applicationState';
import { Editor } from '../../../shared/models/editor';
import { ProjectFile } from '../../../shared/models/projectFile';
import { Size } from '../../../shared/models/size';
import { defineAction } from '../../reduxWithLessSux/action';

interface OpenNewProjectFilePayload {
	dimensions: Size;
}

export const openNewProjectFile = defineAction(
	'openNewProjectFile',
	(state: ApplicationState, payload: OpenNewProjectFilePayload) => {
		const projectFile: ProjectFile = {
			layers: [
				{
					imageSource: undefined,
					isVisible: true,
					name: 'Layer 1',
					points: [],
					polygons: []
				}
			],
			dimensions: payload.dimensions
		};
		const editor: Editor = {
			fileName: undefined,
			hasUnsavedChanges: true,
			projectFile,
			selectedLayerIndex: 0,
			selectedPointIndices: [],
			selectedToolName: undefined,
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
			dialogs: {
				...state.dialogs,
				newProjectFile: {
					...state.dialogs.newProjectFile,
					isVisible: false
				}
			},
			editors,
			activeEditorIndex
		};
	}
).getDispatcher();
