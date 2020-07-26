import {
  PolygenDocument,
  LegacyPolygenDocument,
} from '../../shared/models/polygenDocument';
import { ImageSource } from '../../shared/models/imageSource';
import { LegacyLayer } from '../../shared/models/layer';
import { Layer } from '../../shared/models/layer';

export function upgradeDocument(
  document: PolygenDocument | LegacyPolygenDocument
): PolygenDocument {
  const images: ImageSource[] = [];
  const layers: Array<Layer | LegacyLayer> = document.layers;

  return {
    ...document,
    images,
    layers: layers.map((layer) => {
      const {
        image: { source, ...image },
      } = layer as LegacyLayer;

      if (!source) {
        return layer;
      }

      let existingImage = images.find(
        (loopImage) => loopImage.data === source.data
      );

      if (!existingImage) {
        existingImage = source;
        images.push(source);
      }

      const updatedImage = {
        ...image,
        imageId: existingImage.id,
      };

      return {
        ...layer,
        image: updatedImage,
      };
    }),
  };
}
