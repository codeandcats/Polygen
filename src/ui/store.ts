import { ApplicationState, DEFAULT_APPLICATION_STATE } from '../shared/models/applicationState';
import { Store } from './reduxWithLessSux/store';

export const store = new Store<ApplicationState>(DEFAULT_APPLICATION_STATE);

export default store;
