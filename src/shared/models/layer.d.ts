import { Point } from './point';
import { Polygon } from './polygon'

export interface Layer {
	isVisible: boolean;
	name: string;
	points: Point[];
	polygons: Polygon[];
}
