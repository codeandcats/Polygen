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

cssRule('.btn', {
	transition: 'background-color .3s'
});

export const iconButton = style({
	$nest: {
		'i.fa': {
			transition: 'transform .2s'
		},
		'&:hover i.fa, &.active i.fa': {
			transform: 'scale(1.2)'
		}
	}
});
