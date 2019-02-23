import { ApplicationState, DEFAULT_APPLICATION_STATE } from '../../shared/models/applicationState';
import { Reducer, Store } from './store';

type StoreActionDispatcher<TState, TPayload> = (store: Store<TState>, payload?: TPayload) => void;

type ActionDispatcher<TPayload> = (payload?: TPayload) => void;

export class ActionDefinition<TState, TPayload> {
  constructor(
    public readonly type: string,
    private reducer: (state: TState, payload: TPayload, type?: string) => TState) {
  }

  public getDispatcher(): StoreActionDispatcher<TState, TPayload>;
  public getDispatcher(store: Store<TState>): ActionDispatcher<TPayload>;

  public getDispatcher(
    store?: Store<TState>
  ): StoreActionDispatcher<TState, TPayload> | ActionDispatcher<TPayload> {
    if (!store) {
      return (toStore: Store<TState>, payload?: TPayload) => {
        toStore.dispatch(this, payload);
      };
    }

    if (!store.isActionRegistered(this.type)) {
      store.registerAction(this.type, this.reducer);
    }

    return (payload?: TPayload) => {
      store.dispatch(this, payload);
    };
  }

  public getReducer() {
    return this.reducer;
  }
}

export function defineAction<TState, TPayload>(
  type: string,
  reducer: Reducer<TState, TPayload>
): ActionDefinition<TState, TPayload> {
  return new ActionDefinition(type, reducer);
}
