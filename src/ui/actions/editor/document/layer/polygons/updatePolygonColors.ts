import { ApplicationState } from '../../../../../../shared/models/applicationState';
import { Point } from '../../../../../../shared/models/point';
import { Polygon } from '../../../../../../shared/models/polygon';
import { ImageCache } from '../../../../../models/imageCache';
import { defineAction } from '../../../../../reduxWithLessSux/action';
import { getAbsoluteDocumentPoint, getLayerPixelData, getPolygonAverageColor } from '../../../../../utils/graphics';

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
								const layerPixelData = getLayerPixelData(document, layer, payload.imageCache);
								const polygons: Polygon[] = [];

								for (const polygon of layer.polygons) {
									const points = polygon.pointIndices
										.map(index => {
											let point = getAbsoluteDocumentPoint(layer.points[index], document.dimensions);
											point = {
												x: point.x + (document.dimensions.width / 2),
												y: point.y + (document.dimensions.height / 2)
											};
											return point;
										}) as [Point, Point, Point];
									const color = getPolygonAverageColor(layerPixelData, points);
									polygons.push({
										...polygon,
										color
									});
								}

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
