import { ApplicationState } from '../../../../../shared/models/applicationState';
import { ImageSource } from '../../../../../shared/models/imageSource';
import { Nullable } from '../../../../../shared/models/nullable';
import { defineAction } from '../../../../reduxWithLessSux/action';
import { purgeUnusedImages } from '../purgeUnusedImages';

interface SetLayerImagePayload {
  layerIndex: number;
  imageSource: Nullable<ImageSource>;
}

export const setLayerImage = defineAction(
  'setLayerImage',
  (state: ApplicationState, payload: SetLayerImagePayload) => {
    const editors = state.editors.map((editor, editorIndex) => {
      if (editorIndex === state.activeEditorIndex) {
        const images = editor.document.images.find(
          (image) => image.id === payload.imageSource?.id
        )
          ? editor.document.images
          : [...editor.document.images, payload.imageSource].filter(Boolean);

        return {
          ...editor,
          document: purgeUnusedImages({
            ...editor.document,
            images,
            layers: editor.document.layers.map((layer, layerIndex) => {
              if (layerIndex === payload.layerIndex) {
                layer = {
                  ...layer,
                  image: {
                    ...layer.image,
                    imageId: payload.imageSource?.id || undefined,
                  },
                };
              }
              return layer;
            }),
          }),
        };
      }
      return editor;
    });

    return {
      ...state,
      editors,
    };
  }
).getDispatcher();
