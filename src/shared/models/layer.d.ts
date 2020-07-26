import { Point } from './point';
import { Polygon } from './polygon';
import { Nullable } from './nullable';
import { LayerImage, LegacyLayerImage } from './layerImage';
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

export type LegacyLayer = Pick<Layer, Exclude<keyof Layer, 'image'>> & {
  image: LegacyLayerImage;
};
