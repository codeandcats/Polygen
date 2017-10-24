declare module 'cdt2d' {
	namespace cdt2d {
		type Point = [number, number];

		type PointIndex = number;

		type Polygon = [PointIndex, PointIndex, PointIndex];

		type Edge = [PointIndex, PointIndex];

		interface Options {
			/**
			 * If true then the resulting triangulation is converted to a Delaunay triangulation by edge flipping. Otherwise if it is false, then an arbitrary triangulation is returned. (Default true)
			 */
			delaunay?: boolean;

			/**
			 * If true then will return interior faces. See note. (Default true)
			 */
			interior?: boolean;

			/**
			 * If true then will return exterior faces. See note. (Default true)
			 */
			exterior?: boolean;

			/**
			 * If true then the triangulation is augmented with a point at infinity represented by the index -1. (Default false)
			 */
			infinity?: boolean;
		}
	}

	function cdt2d(points: cdt2d.Point[], edgeIndices?: cdt2d.Edge[], options?: cdt2d.Options): cdt2d.Polygon[];

	export = cdt2d;
}
