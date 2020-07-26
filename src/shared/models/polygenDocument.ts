import { ImageSource } from './imageSource';
import { Layer, LegacyLayer } from './layer';
import { Size } from './size';

export interface PolygenDocument {
  images: ImageSource[];
  dimensions: Size;
  layers: Layer[];
}

export type LegacyPolygenDocument = Pick<
  PolygenDocument,
  Exclude<keyof PolygenDocument, 'layers'>
> & {
  layers: LegacyLayer[];
};
