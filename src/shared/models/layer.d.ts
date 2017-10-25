import { Point } from './point';
import { Polygon } from './polygon'
import { ImageSource } from './imageSource';
import { Nullable } from './nullable';

export interface Layer {
	imageSource: Nullable<ImageSource>;
	isVisible: boolean;
	name: string;
	points: Point[];
	polygons: Polygon[];
}
