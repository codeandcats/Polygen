import { Point } from './point';
import { Polygon } from './polygon';
import { ImageSource } from './imageSource';
import { Nullable } from './nullable';
import { LayerImage } from './layerImage';
import { FloatPercent } from './floatPercent';

export interface Layer {
  image: LayerImage;
  isVisible: boolean;
  name: string;
  transparencyThreshold?: Nullable<FloatPercent>;
  opacityThreshold?: Nullable<FloatPercent>;
  points: Point[];
  polygons: Polygon[];
}
