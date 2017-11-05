import { style } from 'typestyle';

export const layerBackgroundImageForm = style({
	$debugName: 'layerBackgroundImageForm',

	$nest: {
		'form-group:last-of-type': {
			marginBottom: 0
		},
		'a.thumbnail': {
			marginBottom: 0,
			cursor: 'default',

			$nest: {
				'&:hover, &:focus, &:active': {
					borderColor: '#ddd'
				}
			}
		}
	}
});
