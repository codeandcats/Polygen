import { percent, px } from 'csx';
import { style } from 'typestyle';

export const welcomePage = style({
  $debugName: 'welcomePage',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  width: percent(100),
  height: percent(100),

  $nest: {
    '.jumbotron': {
      margin: 0,
      width: percent(90),
      height: percent(90),
      display: 'flex',
      flexDirection: 'column',
    },

    h6: {
      marginTop: px(20),
    },
  },
});

export const fileList = style({
  overflowY: 'scroll',
  border: '1px solid #444',
  borderRadius: px(4),

  $nest: {
    '.list-group-item:first-of-type': {
      borderTop: 0,
    },
  },
});
