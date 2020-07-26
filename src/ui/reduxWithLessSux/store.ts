import { createStore, Store as ReduxStore } from 'redux';
import { ActionDefinition } from './action';

class ActionAlreadyRegistered extends Error {
  constructor(type: string) {
    super(`Action type ${type} already registered with store`);
  }
}

interface ReduxAction<TPayload> {
  type: string;
  payload: TPayload;
}

type ReduxReducer<TState, TPayload> = (
  state: TState,
  action: ReduxAction<TPayload>
) => TState;

export type Reducer<TState, TPayload> = (
  state: TState,
  payload: TPayload,
  type?: string
) => TState;

interface ReducerByTypeMap<TState> {
  [type: string]: Reducer<TState, any>;
}

type Unsubscribe = () => void;

// TODO: Could totally replace redux at this point

export class Store<TState> {
  private readonly store: ReduxStore<TState>;
  private readonly reducerByType: ReducerByTypeMap<TState> = {};

  private reduce: ReduxReducer<TState, any> = (
    state: TState,
    action: ReduxAction<any>
  ) => {
    const reduce = this.reducerByType[action.type];

    if (reduce) {
      state = reduce(state, action.payload, action.type);
    }

    return state;
  };

  constructor(initialState: TState) {
    this.store = createStore(
      (state, action: ReduxAction<TState>) =>
        this.reduce((state || {}) as TState, action),
      initialState
    );
  }

  public dispatch<TPayload>(
    definition: ActionDefinition<TState, TPayload>,
    payload: TPayload
  ): void {
    if (!this.isActionRegistered(definition.type)) {
      this.registerAction(definition.type, definition.getReducer());
    }
    this.store.dispatch({ type: definition.type, payload });
  }

  public getState(): TState {
    return this.store.getState();
  }

  public isActionRegistered(type: string): boolean {
    const isActionRegistered = !!this.reducerByType[type];
    return isActionRegistered;
  }

  public registerAction(
    type: string,
    reducer: (state: TState, payload: any) => TState
  ): this {
    const isActionAlreadyRegistered = this.isActionRegistered(type);

    if (isActionAlreadyRegistered) {
      throw new ActionAlreadyRegistered(type);
    }

    this.reducerByType[type] = reducer;

    return this;
  }

  public subscribe(callback: () => void): Unsubscribe {
    callback();
    return this.store.subscribe(callback);
  }
}
