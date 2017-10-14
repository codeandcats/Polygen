import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MainWindow } from './index';

const container = document.getElementById('content') as HTMLElement;

ReactDOM.render(<MainWindow />, container);
