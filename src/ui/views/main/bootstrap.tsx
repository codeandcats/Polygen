import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install();
import store from '../../store';
import { Application } from './application';

const app = new Application(window, store);
