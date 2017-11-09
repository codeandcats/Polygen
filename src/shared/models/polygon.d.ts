import { Point } from './point';
import { Rgba } from './rgba';

export interface Polygon {
	pointIndices: [number, number, number];
	color: Rgba;
}
