import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Polygon } from '../../../../../../shared/models/polygon';
import { ImageCache } from '../../../../../models/imageCache';
import { defineAction } from '../../../../../reduxWithLessSux/action';
import { recalculatePolygonColours } from '../../../../../utils/graphics';

interface UpdatePolygonColorsPayload {
	imageCache: ImageCache;
}

export const updatePolygonColors = defineAction(
	'updatePolygonColors', (state: ApplicationState, payload: UpdatePolygonColorsPayload) => {
		const editors = state.editors.map((editor, editorIndex) => {
			if (editorIndex === state.activeEditorIndex) {
				const document = editor.document;
				return {
					...editor,
					document: {
						...document,
						layers: document.layers.map((layer, layerIndex) => {
							if (layerIndex === editor.selectedLayerIndex) {
								const polygons: Polygon[] = recalculatePolygonColours({
									document,
									imageCache: payload.imageCache,
									layer,
									points: layer.points,
									polygons: layer.polygons
								});

								return {
									...layer,
									polygons
								};
							}
							return layer;
						})
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
