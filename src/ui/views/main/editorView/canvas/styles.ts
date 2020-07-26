import { px } from 'csx';
import { style } from 'typestyle';

export const canvas = style({
  $debugName: 'canvas',

  borderColor: '333',
  borderWidth: px(0),
  borderStyle: 'solid',
  marginBottom: px(10),

  $nest: {
    '&:focus': {
      outline: 'none',
    },
  },
});
