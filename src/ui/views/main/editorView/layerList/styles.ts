import { cssRule, style } from 'typestyle';

export const layerList = style({
	$nest: {
		ul: {
			padding: 0,
			width: '100%'
		}
	}
});

export const layerListHeader = style({
	marginBottom: 10,
	$nest: {
		'.control-label': {
			margin: 0
		}
	}
});

export const layerListItem = style({
	listStyle: 'none',

	$nest: {
		'.btn:focus': {
			outline: 'none'
		},
		'&:not(:first-of-type):not(:last-of-type) .btn-group .btn': {
			borderRadius: 0,
			borderTop: 0
		},
		'&:not(:last-of-type):first-of-type .btn-group .btn': {
			borderBottomLeftRadius: 0,
			borderBottomRightRadius: 0
		},
		'&:not(:first-of-type):last-of-type .btn-group .btn': {
			borderTopLeftRadius: 0,
			borderTopRightRadius: 0,
			borderTop: 0
		},
		'&>.btn-group': {
			display: 'flex',
			flexDirection: 'row',

			$nest: {
				'.btn:first-of-type': {
					flexGrow: 1
				}
			}
		}
	}
});

export const layerListItemInvisible = style({
	$nest: {
		'&>.btn-group': {
			opacity: .75
		}
	}
});
