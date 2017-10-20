import * as jQuery from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import store from '../../store';
import { MainWindow } from './index';

function attachJQuery(globals: any) {
	globals.$ = jQuery;
	globals.jQuery = jQuery;
}
attachJQuery(window);

const container = document.getElementById('content') as HTMLElement;

store.subscribe(() => ReactDOM.render(<MainWindow store={store} />, container));
