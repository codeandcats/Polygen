/**
 * Creates a copy of the specified array with the element
 * located at `fromIndex` moved to `toIndex` and returns the new array.
 */
export function moveElement<T>(items: T[], fromIndex: number, toIndex: number): T[] {
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
