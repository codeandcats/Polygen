import { ApplicationState } from '../../../../../shared/models/applicationState';
import { Layer } from '../../../../../shared/models/layer';
import { Point } from '../../../../../shared/models/point';
import { moveElement } from '../../../../../shared/utils/arrays';
import { defineAction } from '../../../../reduxWithLessSux/action';

export const addLayer = defineAction(
	'addLayer', (state: ApplicationState) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				const document = editor.document;
				const newLayer: Layer = {
					image: {
						topLeft: { x: -1, y: -1 },
						bottomRight: { x: 1, y: 1 },
						source: undefined
					},
					isVisible: true,
					name: `Layer ${ document.layers.length + 1 }`,
					points: [],
					polygons: []
				};
				const layers = [...document.layers].concat(newLayer);

				return {
					...editor,
					document: {
						...document,
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
