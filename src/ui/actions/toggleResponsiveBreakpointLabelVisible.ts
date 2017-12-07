import { ApplicationState } from '../../shared/models/applicationState';
import { Editor } from '../../shared/models/editor';
import { Point } from '../../shared/models/point';
import { defineAction } from '../reduxWithLessSux/action';

export const toggleResponsiveBreakpointLabelVisible = defineAction(
	'toggleResponsiveBreakpointLabelVisible',
	(state: ApplicationState) => {
		const isResponsiveBreakpointLabelVisible = !state.isResponsiveBreakpointLabelVisible;
		return {
			...state,
			isResponsiveBreakpointLabelVisible
		};
	}
).getDispatcher();
