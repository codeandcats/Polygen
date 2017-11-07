import { ApplicationState } from '../../shared/models/applicationState';
import { Dialogs } from '../../shared/models/dialogs';
import { Nullable } from '../../shared/models/nullable';
import { defineAction } from '../reduxWithLessSux/action';

interface FocusedElementChangedPayload {
	isInput: boolean;
	isTextInput: boolean;
}

export const focusedElementChanged = defineAction(
	'focusedElementChanged', (state: ApplicationState, payload: FocusedElementChangedPayload) => {
		const { isInput, isTextInput } = payload;
		const result: ApplicationState = {
			...state,
			focusedElement: {
				isInput,
				isTextInput
			}
		};
		return result;
	}
).getDispatcher();

export function isElementAnInput(element: Nullable<Element>): boolean {
	if (!element) {
		return false;
	}

	const tagName = element.tagName.toLowerCase();
	const INPUT_TYPES = ['input', 'select', 'option', 'button', 'textarea'];

	return (INPUT_TYPES.indexOf(tagName) > -1);
}

export function isElementATextInput(element: Nullable<Element>): boolean {
	if (!element) {
		return false;
	}

	const tagName = element.tagName.toLowerCase();
	const type = (element.getAttribute('type') || 'text').toLowerCase();
	const TEXT_INPUT_TYPES = ['text', 'password', 'number'];

	if (tagName === 'input' && TEXT_INPUT_TYPES.indexOf(type) > -1) {
		return true;
	}

	if (tagName === 'textarea') {
		return true;
	}

	return false;
}
