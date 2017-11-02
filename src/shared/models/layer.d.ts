import { Point } from './point';
import { Polygon } from './polygon'
import { ImageSource } from './imageSource';
import { Nullable } from './nullable';
import { LayerImage } from './layerImage';

export interface Layer {
	image: LayerImage;
	isVisible: boolean;
	name: string;
	points: Point[];
	polygons: Polygon[];
}
