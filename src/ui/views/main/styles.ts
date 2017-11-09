import { important, percent, px, viewHeight, viewWidth } from 'csx';
import { cssRule, style } from 'typestyle';

export const backgroundColor = '#444';
export const textColor = '#eee';

cssRule('html, body', {
	height: percent(100)
});

cssRule('span, p, label', {
	userSelect: 'none',
	cursor: 'default'
});

cssRule('#content', {
	height: viewHeight(100),
	width: viewWidth(100)
});

export const mainWindow = style({
	$debugName: 'mainWindow',

	height: percent(100),
	width: percent(100)
});

cssRule('.panel-body', {
	padding: px(10)
});

export const spaceRight = style({
	$debugName: 'spaceRight',

	marginRight: px(10)
});

export const spaceBelow = style({
	$debugName: 'spaceBelow',

	marginBottom: px(10)
});

cssRule('.btn', {
	transition: 'background-color .3s'
});

export const iconButton = style({
	$debugName: 'iconButton',

	$nest: {
		'i.fa': {
			transition: 'transform .2s'
		},
		'&:hover i.fa, &.active i.fa': {
			transform: 'scale(1.2)'
		}
	}
});

export const buttonSpaceLeft = style({
	$debugName: 'buttonSpaceLeft',

	marginLeft: px(5)
});

export const buttonSpaceRight = style({
	$debugName: 'buttonSpaceRight',

	marginRight: px(5)
});

cssRule('*:focus', {
	outlineWidth: important(px(3) as any)
});
