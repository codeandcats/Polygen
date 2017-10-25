import { Layer } from './layer';
import { Size } from './size';

export interface ProjectFile {
	dimensions: Size;
	layers: Layer[];
}
