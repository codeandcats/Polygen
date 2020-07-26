import { ImageSource } from './imageSource';
import { Point } from './point';
import { Rectangle } from './rectangle';
import { Nullable } from './nullable';

export interface LayerImage {
  topLeft: Point;
  bottomRight: Point;
  source: Nullable<ImageSource>;
}
