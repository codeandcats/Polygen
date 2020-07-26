import { cssRule } from 'typestyle';

cssRule('.input-group', {
  $nest: {
    'input.form-control': {
      borderColor: '#222529',
    },
    '.input-group-addon': {
      backgroundColor: '#222529',
      borderColor: '#222529',
    },
  },
});

cssRule('.has-error .input-group-addon', {
  borderColor: '#ee5f5b',
});

cssRule('.help-block', {
  color: '#888',
});

cssRule('.btn.disabled, .btn[disabled], fieldset[disabled] .btn', {
  opacity: 0.55,
});
