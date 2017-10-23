/**
 * Returns the percentage of time past as a number clamped between 0 and 1
 */
export function getAnimationProgress(startTime: number, duration: number, currentTime?: number): number {
	if (currentTime === undefined) {
		currentTime = Date.now();
	}

	if (duration === 0) {
		return 1;
	}

	const durationPast = currentTime - startTime;

	const progress = Math.min(1, durationPast / duration);

	return progress;
}
