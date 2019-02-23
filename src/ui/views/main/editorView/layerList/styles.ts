import { percent, px } from 'csx';
import { cssRule, style } from 'typestyle';

export const layerList = style({
  $debugName: 'layerList',

  $nest: {
    '>ul': {
      padding: px(10),
      paddingTop: 0,
      width: percent(100)
    }
  }
});

export const layerListHeader = style({
  $debugName: 'layerListHeader',

  padding: px(10)
});

export const addLayerButton = style({
});

export const layerListItem = style({
  $debugName: 'layerListItem',

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
          flexGrow: 1,
          overflow: 'hidden',
          textAlign: 'left',
          textOverflow: 'ellipsis'
        }
      }
    }
  }
});

export const layerNameButton = style({
  $debugName: 'layerNameButton'
});

export const layerVisibilityButton = style({
  $debugName: 'layerVisibilityButton',
  maxWidth: px(40)
});

export const layerActionsButton = style({
  $debugName: 'layerActionsButton',

  $nest: {
    '.btn': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    }
  }
});

export const layerListItemInvisible = style({
  $debugName: 'layerListItemInvisible',

  $nest: {
    '&>.btn-group .btn': {
      opacity: .75
    }
  }
});
