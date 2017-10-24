import { Point } from './point';
import { Rgb } from './rgb';

export interface Polygon {
	pointIndices: number[];
	color: Rgb;
}
