// Borrowed from https://gist.github.com/Yaffle/1145197

'use strict';

const IDENTITY = new WebKitCSSMatrix();

class Point {
  constructor(public x: number, public y: number, public z: number) {}

  public transformBy(matrix: WebKitCSSMatrix) {
    const tmp = matrix.multiply(IDENTITY.translate(this.x, this.y, this.z));
    return new Point(tmp.m41, tmp.m42, tmp.m43);
  }
}

function getTransformationMatrix(element: HTMLElement) {
  let transformationMatrix = IDENTITY;
  let x: Element | null = element;

  while (x && x !== (x.ownerDocument && x.ownerDocument.documentElement)) {
    const computedStyle = window.getComputedStyle(x, undefined);
    const transform = computedStyle.transform || 'none';
    const c = transform === 'none' ? IDENTITY : new WebKitCSSMatrix(transform);
    transformationMatrix = c.multiply(transformationMatrix);
    x = x.parentNode as Element;
  }

  const w = element.offsetWidth;
  const h = element.offsetHeight;
  let i = 4;
  let left = +Infinity;
  let top = +Infinity;
  while (--i >= 0) {
    const p = new Point(
      i === 0 || i === 1 ? 0 : w,
      i === 0 || i === 3 ? 0 : h,
      0
    ).transformBy(transformationMatrix);
    if (p.x < left) {
      left = p.x;
    }
    if (p.y < top) {
      top = p.y;
    }
  }
  const rect = element.getBoundingClientRect();
  transformationMatrix = IDENTITY.translate(
    window.pageXOffset + rect.left - left,
    window.pageYOffset + rect.top - top,
    0
  ).multiply(transformationMatrix);

  return transformationMatrix;
}

/**
 * Returns coordinate in element's local coordinate system
 * (works properly with css transforms without perspective projection)
 */
export function convertPointFromPageToNode(
  element: HTMLElement,
  pageX: number,
  pageY: number
) {
  return new Point(pageX, pageY, 0).transformBy(
    getTransformationMatrix(element).inverse()
  );
}

/**
 * Returns coordinate in window's coordinate system
 * (works properly with css transforms without perspective projection)
 */
export function convertPointFromNodeToPage(
  element: HTMLElement,
  offsetX: number,
  offsetY: number
) {
  return new Point(offsetX, offsetY, 0).transformBy(
    getTransformationMatrix(element)
  );
}
