import { Point } from './point';

export interface ViewPort {
	isFramesPerSecondVisible: boolean;
	pan: Point;
	zoom: number;
}
