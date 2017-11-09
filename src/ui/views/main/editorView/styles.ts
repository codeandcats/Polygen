import { percent, px } from 'csx';
import { style } from 'typestyle';
import * as mainStyles from '../styles';
import './theme';

export const LAYER_LIST_WIDTH = 300;

export const editorContainer = style({
	$debugName: 'editorContainer',

	height: percent(100),
	display: 'flex',
	flexDirection: 'column'
});

export const editorBody = style({
	$debugName: 'editorBody',

	display: 'flex',
	flex: '1 1 auto',
	position: 'relative',
	overflowY: 'scroll',
	flexDirection: 'row'
});

export const editorFooter = style({
	$debugName: 'editorFooter',

	flex: '0 1 auto',
	textAlign: 'left',
	padding: px(10)
});

export const editorBodyMain = style({
	$debugName: 'editorBodyMain',

	display: 'flex',
	flexDirection: 'column',
	flex: '1 1 auto'
});

export const editorBodyMainHeader = style({
	$debugName: 'editorBodyMainHeader',

	flex: '0 1 auto',
	padding: px(10)
});

export const editorBodyMainCanvasContainer = style({
	$debugName: 'editorBodyMainCanvasContainer',

	flex: '1 1 auto',
	overflow: 'hidden'
});

export const editorBodyRight = style({
	$debugName: 'editorBodyRight',

	flexBasis: px(LAYER_LIST_WIDTH),
	overflowY: 'scroll',
	padding: px(10)
});
