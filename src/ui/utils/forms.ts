const TEXT_INPUT_TYPES = ['number', 'password', 'text'];

export function canElementSelectAll(element: Element) {
	if (
		element.tagName === 'INPUT' &&
		TEXT_INPUT_TYPES.indexOf(element.getAttribute('type') || 'text') > -1
	) {
		return true;
	}

	if (element.tagName === 'TEXTAREA') {
		return true;
	}

	return false;
}

export function canElementDelete(element: Element) {
	if (element.tagName === 'INPUT') {
		return true;
	}

	if (element.tagName === 'TEXTAREA') {
		return true;
	}

	return false;
}
