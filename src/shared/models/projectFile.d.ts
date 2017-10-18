import { Layer } from './layer';
import { Size } from './size';

export interface ProjectFile {
	size: Size;
	layers: Layer[];
}
