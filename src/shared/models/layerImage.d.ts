import { ImageSource } from './imageSource';
import { Point } from './point';
import { Nullable } from './nullable';

export interface LayerImage {
  topLeft: Point;
  bottomRight: Point;
  imageId?: string;
}

export type LegacyLayerImage = Pick<
  LayerImage,
  Exclude<keyof LayerImage, 'sourceId'>
> & {
  source?: Nullable<ImageSource>;
};
