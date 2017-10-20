import { px } from 'csx';
import { cssRule, style } from 'typestyle';

cssRule('body', {
	paddingTop: px(15)
});

cssRule('.panel-body', {
	padding: px(10)
});

export const spaceRight = style({
	marginRight: px(10)
});

export const spaceBelow = style({
	marginBottom: px(10)
});
