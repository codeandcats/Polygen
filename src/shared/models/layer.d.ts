import { Point } from './point';

export interface Layer {
	isVisible: boolean;
	name: string;
	points: Point[];
}
