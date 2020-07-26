declare module 'circumcenter' {
  type Point = [number, number];

  type Triangle = [Point, Point, Point];

  function circumcenter(triangle: Triangle): Point;

  export = circumcenter;
}
