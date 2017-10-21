type BreakpointType = 'xs' | 'sm' | 'md' | 'lg';

export function getCurrentBreakpointType(): BreakpointType {
	const windowWidth = window.innerWidth;

	if (windowWidth < 768) {
		return 'xs';
	} else if (windowWidth < 992) {
		return 'sm';
	} else if (windowWidth < 1200) {
		return 'md';
	} else {
		return 'lg';
	}
}
