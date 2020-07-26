/**
 * Creates a copy of the specified array with the element
 * located at `fromIndex` moved to `toIndex` and returns the new array.
 */
export function moveElement<T>(
  items: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  // Create a copy of the array
  items = [...items];

  if (items.length < 2) {
    return items;
  }

  toIndex = Math.min(toIndex, items.length - 1);
  toIndex = Math.max(toIndex, 0);

  if (toIndex === fromIndex) {
    return items;
  }

  items.splice(toIndex, 0, items.splice(fromIndex, 1)[0]);

  return items;
}

export interface CompareArraysOptions<TLeft, TRight> {
  left: TLeft[];
  right: TRight[];
  compare: (left: TLeft, right: TRight) => number;
}

export interface CompareArrayOptionsWithEvents<TLeft, TRight>
  extends CompareArraysOptions<TLeft, TRight> {
  missingInLeft?: (right: TRight) => void;
  missingInRight?: (left: TLeft) => void;
  matched?: (left: TLeft, right: TRight) => void;
}

/**
 * Compares 2 arrays, both in ascending order, and reports back on missing and matched items.
 * Note that this function will not work correctly unless the arrays you provide are both in ascending order.
 * Implementation deliberately avoids adding automatic sorting/checking for performance, so its up to the
 * caller to get it right.
 */
export function compareArrays<TLeft, TRight>(
  options: CompareArrayOptionsWithEvents<TLeft, TRight>
): void {
  const {
    left,
    right,
    compare,
    missingInLeft,
    missingInRight,
    matched,
  } = options;

  const leftLength = left.length;
  const rightLength = right.length;

  let leftIndex = 0;
  let rightIndex = 0;

  const leftFinished = () => leftIndex >= leftLength;
  const rightFinished = () => rightIndex >= rightLength;

  while (!leftFinished() || !rightFinished()) {
    const leftItem = left[leftIndex];
    const rightItem = right[rightIndex];

    const result = leftFinished()
      ? 1
      : rightFinished()
      ? -1
      : compare(leftItem, rightItem);

    if (result < 0) {
      if (missingInRight) {
        missingInRight(leftItem);
      }
      leftIndex++;
    } else if (result > 0) {
      if (missingInLeft) {
        missingInLeft(rightItem);
      }
      rightIndex++;
    } else {
      if (matched) {
        matched(leftItem, rightItem);
      }
      leftIndex++;
      rightIndex++;
    }
  }
}

export interface CompareArraysResults<TLeft, TRight> {
  missingInLeft: TRight[];
  missingInRight: TLeft[];
  matched: Array<{ left: TLeft; right: TRight }>;
}

export function compareArraysWithResults<TLeft, TRight>(
  options: CompareArraysOptions<TLeft, TRight>
): CompareArraysResults<TLeft, TRight> {
  const result = {
    missingInLeft: [] as TRight[],
    missingInRight: [] as TLeft[],
    matched: [] as Array<{ left: TLeft; right: TRight }>,
  };

  compareArrays({
    ...options,
    missingInLeft: (item) => result.missingInLeft.push(item),
    missingInRight: (item) => result.missingInRight.push(item),
    matched: (left, right) => result.matched.push({ left, right }),
  });

  return result;
}

export class DefaultMap<K, V> extends Map<K, V> {
  constructor(
    protected readonly defaultFactory: (key: K) => V,
    entries?: Array<[K, V]>
  ) {
    super(entries);
  }

  public get(key: K): V {
    let value = super.get(key);
    if (value === undefined) {
      value = this.defaultFactory(key);
      this.set(key, value);
    }
    return value;
  }
}
