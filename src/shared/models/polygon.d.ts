import { Point } from './point';
import { Rgba } from './rgba';
import { TrianglePointIndices } from './trianglePointIndices';

export interface Polygon {
  pointIndices: TrianglePointIndices;
  color: Rgba;
}
