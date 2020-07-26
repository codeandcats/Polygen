import { PolygenDocument } from '../../../../shared/models/polygenDocument';

export function purgeUnusedImages(document: PolygenDocument) {
  const images = document.images.filter((image) =>
    document.layers.some((layer) => layer.image?.imageId === image.id)
  );

  return {
    ...document,
    images,
  };
}
