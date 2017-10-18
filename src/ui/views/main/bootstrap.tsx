import * as React from 'react';
import * as ReactDOM from 'react-dom';
import store from '../../store';
import { MainWindow } from './index';

const container = document.getElementById('content') as HTMLElement;

store.subscribe(() => ReactDOM.render(<MainWindow store={store} />, container));
