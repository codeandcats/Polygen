export function makeMostRecent<T>(
  items: T[],
  mostRecentItem: T,
  options?: { maxListSize?: number, areEqual?: (a: T, b: T) => boolean }
): T[] {
  const maxListSize = (options && options.maxListSize) || Number.POSITIVE_INFINITY;
  const areEqual = (options && options.areEqual) || ((a: T, b: T) => a === b);
  const index = items.findIndex(item => areEqual(item, mostRecentItem));

  if ((index === 0) && (items.length <= maxListSize)) {
    return items;
  }

  const result = [...items];

  if (index > -1) {
    result.splice(index, 1);
  }

  result.unshift(mostRecentItem);

  return result;
}
