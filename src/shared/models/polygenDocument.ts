import { Layer } from './layer';
import { Size } from './size';

export interface PolygenDocument {
	dimensions: Size;
	layers: Layer[];
}
