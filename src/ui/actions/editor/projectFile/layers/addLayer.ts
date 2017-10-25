import { ApplicationState } from '../../../../../shared/models/applicationState';
import { Layer } from '../../../../../shared/models/layer';
import { Point } from '../../../../../shared/models/point';
import { moveElement } from '../../../../../shared/utils/arrays';
import { defineAction } from '../../../../reduxWithLessSux/action';

export const addLayer = defineAction(
	'addLayer', (state: ApplicationState) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				const projectFile = editor.projectFile;
				const newLayer: Layer = {
					imageSource: undefined,
					isVisible: true,
					name: `Layer ${ projectFile.layers.length + 1 }`,
					points: [],
					polygons: []
				};
				const layers = [...projectFile.layers].concat(newLayer);

				return {
					...editor,
					projectFile: {
						...projectFile,
						layers
					},
					selectedLayerIndex: layers.length - 1
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
