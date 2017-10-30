import { percent } from 'csx';
import { style } from 'typestyle';

export const fullScreenContainer = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	position: 'absolute',
	width: percent(100),
	height: percent(100),

	$nest: {
		'.jumbotron': {
			margin: 0
		}
	}
});
