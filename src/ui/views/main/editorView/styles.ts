import { percent, px } from 'csx';
import { style } from 'typestyle';

export const editorView = style({
	display: 'table',
	width: percent(100),
	height: percent(100),
	position: 'absolute'
});

export const bodyRow = style({
	display: 'table-row'
});

export const bodyCell = style({
	display: 'table-cell'
});

export const footerRow = style({
	display: 'table-row'
});

export const footerCell = style({
	display: 'table-cell',
	height: px(70),

	$nest: {
		'.panel': {
			marginBottom: 0
		}
	}
});
