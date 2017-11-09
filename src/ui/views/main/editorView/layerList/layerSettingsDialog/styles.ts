import { style } from 'typestyle';

export const settingsForm = style({
	$debugName: 'settingsForm',

	$nest: {
		'.form-group:last-of-type': {
			marginBottom: 0
		}
	}
});
