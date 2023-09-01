import { CancelledAct } from './cancelled';
import {
  ActinonAlreadyExistingError,
  InvalidDITypeError,
  KeyAlreadyExistsInDIError,
  NotFoundActionError,
} from './errors';
import {
  ActEventName,
  ActExec,
  ActMasterAction,
  ActMasterActionDevDI,
  ActMasterOptions,
  ActSubscribeType,
  devActMasterConfig,
  DIMap,
  EmitAction,
  IActMaster,
  ListenerFunction,
} from './types';

//@ts-ignore
import { version } from '../package.json';

export * from './errors';
export * from './types';
export * from './decorators/index';
export { CancelledAct };

type OnAction = (evName: string, status: 'START' | 'STOP' | 'ERROR') => void;

/**
 *
 */
export class ActMaster implements IActMaster {
  readonly version = version;

  private readonly _actions = new Map<ActEventName, ActMasterAction>();

  private readonly _watchers = new Map<ActEventName, ActEventName[]>();

  private readonly _listeners = new Map<ActEventName, ListenerFunction[]>();

  private readonly _subsMap = new Map<any, (() => void)[]>();

  private _lastUnsubscribe: () => any = () => false;

  private _DIContainer: DIMap = {};

  private readonly _singlePromisesStore = new Map<
    ActEventName,
    Promise<any | CancelledAct>
  >();

  private readonly config: devActMasterConfig = {
    errorOnReplaceDI: false,
    autoUnsubscribeCallback: undefined,
    errorHandlerEventName: undefined,
  };

  private static instance: ActMaster;

  constructor(options: ActMasterOptions = {}) {
    if (ActMaster.instance) {
      return ActMaster.instance;
    }

    const {
      actions,
      di,
      errorOnReplaceDI,
      autoUnsubscribeCallback,
      errorHandlerEventName,
    } = options;

    if (actions) {
      this.addActions(actions);
    }

    if (typeof autoUnsubscribeCallback === 'function') {
      this.config.autoUnsubscribeCallback = autoUnsubscribeCallback;
    }

    if (typeof di === 'object' && di) {
      if (Array.isArray(di)) {
        throw new InvalidDITypeError();
      }
      for (const k in di) {
        if (Object.prototype.hasOwnProperty.call(di, k)) {
          this.setDI(k, di[k]);
        }
      }
    }

    if (typeof errorOnReplaceDI === 'boolean') {
      this.config.errorOnReplaceDI = errorOnReplaceDI;
    }

    if (typeof errorHandlerEventName === 'string') {
      this.config.errorHandlerEventName = errorHandlerEventName;
    }

    ActMaster.instance = this;
  }

  static getInstance(): ActMaster {
    if (!ActMaster.instance) {
      throw new Error('ActMaster not initialized');
    }
    return ActMaster.instance;
  }

  //#region [ Actions ]
  addActions(actions: ActMasterAction[]): void {
    if (Array.isArray(actions)) {
      actions.forEach((action: ActMasterAction) => {
        this.addAction(action);
      });
    }
  }

  addAction(action: ActMasterAction): ActMaster {
    const eventName = action.name;

    if (this._actions.has(eventName)) {
      throw new ActinonAlreadyExistingError(eventName);
    }

    if (action.useEmit) {
      const bindedEmitter: EmitAction = (eventName: ActEventName, ...args) =>
        this.exec(eventName, ...args);

      action.useEmit(bindedEmitter);
    }

    this._actions.set(eventName, action);

    this.emitDIProps(action);

    if (action.watch) {
      action.watch.forEach((watchEventName) => {
        const watchers = this._watchers.get(watchEventName) || [];
        watchers.push(eventName);
        this._watchers.set(watchEventName, watchers);
      });
    }

    return this;
  }

  removeAction(eventName: ActEventName): void {
    if (!this._actions.has(eventName)) {
      throw new NotFoundActionError(eventName);
    }

    this._actions.delete(eventName);
  }

  clearActions(): void {
    this._actions.clear();
  }

  clearListeners(): void {
    for (const eventName in this._listeners) {
      if (this._listeners.has(eventName)) {
        this._listeners.delete(eventName);
      }
    }
  }
  //#endregion

  //#region [ Executions ]
  exec: ActExec = async (eventName, ...args) => {
    if (this._singlePromisesStore.has(eventName)) {
      const promise = this._singlePromisesStore.get(eventName);

      if (promise) {
        return promise;
      }
    }

    const promise = this.emit(eventName, ...args)
      .catch((err: Error) => {
        this.onAction(eventName, 'ERROR');
        return this.catchEmitException(err, eventName);
      })
      .finally(() => {
        this.onAction(eventName, 'STOP');
        if (this._singlePromisesStore.has(eventName)) {
          this._singlePromisesStore.delete(eventName);
        }
      });

    const action = this.getActionOrNull(eventName);

    if (action && action.isSingleExec) {
      this._singlePromisesStore.set(eventName, promise);
    }

    return promise;
  };

  private async emit<T2>(
    eventName: ActEventName,
    ...args: any[]
  ): Promise<T2 | null> {
    const action = this.getActionOrNull(eventName);
    this.onAction(eventName, 'START');

    if (action === null) {
      throw new NotFoundActionError(eventName);
    }

    // validator
    if (action.validateInput) {
      const isValidOrError = await action.validateInput(...args);

      if (isValidOrError !== true) {
        if (this.config.errorHandlerEventName) {
          this.emit(this.config.errorHandlerEventName, isValidOrError);
        }
        if (action.errorHandlerEventName) {
          this.emit(action.errorHandlerEventName, isValidOrError);
        }

        return isValidOrError;
      }
    }

    try {
      const value: T2 = await action.exec(...args);

      if (value instanceof CancelledAct || CancelledAct.is(value)) {
        return value;
      }

      this.notifyListeners(eventName, value);

      return value;
    } catch (err: any) {
      return this.catchEmitException(err, eventName);
    }
  }

  private catchEmitException(error: Error, eventName: ActEventName) {
    if (error instanceof NotFoundActionError) {
      throw error;
    }

    const action = this.getActionOrNull(eventName);

    if (
      action?.errorHandlerEventName &&
      action.errorHandlerEventName !== eventName
    ) {
      // Act has own error handler
      this.emit(action.errorHandlerEventName, error);
      return Promise.resolve(null);
    }

    if (
      this.config.errorHandlerEventName &&
      this.config.errorHandlerEventName !== eventName
    ) {
      this.emit(this.config.errorHandlerEventName, error);
      return Promise.resolve(null);
    }

    return Promise.reject(error);
  }

  private notifyListeners(eventName: ActEventName, value: any): void {
    const listeners = this._listeners.get(eventName);

    if (listeners) {
      listeners.forEach((listenerCallback) => {
        listenerCallback(value);
      });
    }

    if (this._watchers.has(eventName)) {
      for (const watchingEventName of this._watchers.get(eventName) || []) {
        this.exec(watchingEventName, value); // Without waiting
      }
    }
  }
  //#endregion

  //#region [ Subscribing ]
  subscribe: ActSubscribeType = (eventName, listener, context?: any) => {
    this._listeners.set(eventName, [
      ...(this._listeners.get(eventName) || []),
      listener,
    ]);

    const unsubscribe = () => this.unsubscribe(eventName, listener);

    this._lastUnsubscribe = unsubscribe;

    if (this.config.autoUnsubscribeCallback) {
      this.config.autoUnsubscribeCallback({
        context,
        listener,
        eventName,
      });
    }

    if (context) {
      this.subsList.add(context);
    }

    return unsubscribe;
  };

  unsubscribe(eventName: ActEventName, listener: ListenerFunction): boolean {
    const listeners = this._listeners.get(eventName);
    if (!listeners) {
      this._subsMap.set(eventName, []);
      return false;
    }

    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }

    this._listeners.set(eventName, listeners);

    return index > -1;
  }

  once: ActSubscribeType = (
    eventName: ActEventName,
    listener: ListenerFunction
  ) => {
    const unsubscribe = this.subscribe(eventName, (...args) => {
      unsubscribe();
      listener(...args);
    });
    return unsubscribe;
  };

  on: ActSubscribeType = (
    eventName: ActEventName,
    listener: ListenerFunction,
    context?: any
  ) => {
    return this.subscribe(eventName, listener, context);
  };

  off(eventName: ActEventName, listener: ListenerFunction): boolean {
    return this.unsubscribe(eventName, listener);
  }
  //#endregion

  //#region [ extends functions ]

  get subsList() {
    return {
      add: (key: any, ...fns: (() => any)[]) => {
        if (!fns.length) {
          fns.push(this._lastUnsubscribe);
        }
        const list = this._subsMap.get(key) || [];
        list.push(...fns);
        this._subsMap.set(key, list);
      },

      clear: (key: any) => {
        const list = this._subsMap.get(key) || [];
        list.forEach((unsubscribe) => unsubscribe());
        this._subsMap.delete(key);
      },
    };
  }

  // #endregion

  //#region [ DI ]
  clearDI(): void {
    this._DIContainer = {};
  }

  setDI(key: string, ctx: any): ActMaster {
    if (this.config.errorOnReplaceDI && this._DIContainer[key]) {
      throw new KeyAlreadyExistsInDIError(key);
    }
    this._DIContainer[key] = ctx;
    this.freshEmitDI();
    return this;
  }

  private freshEmitDI() {
    let action: ActMasterAction | undefined;
    Object.keys(this._actions).forEach((key: string) => {
      action = this._actions.get(key);
      if (action) {
        this.emitDIProps(action);
      }
    });
  }

  private emitDIProps(action: ActMasterActionDevDI) {
    // For UseDI decorator
    if (!action._DI_CONTAINER_) {
      Object.defineProperty(action, '_DI_CONTAINER_', {
        get: () => this._DIContainer,
        enumerable: false, // Uncomment for DEBUG
      });
    }

    if (action._DI_MAP_) {
      Object.keys(action._DI_MAP_).forEach((k) => {
        if (action[k]) {
          return;
        }
        const propKey = action._DI_MAP_?.[k];
        if (!propKey) {
          return;
        }
        Object.defineProperty(action, k, {
          get() {
            return this._DI_CONTAINER_[propKey];
          },
          enumerable: true,
        });
      });
    }

    if (action.useDI) {
      action.useDI(this._DIContainer);
    }
  }
  //#endregion

  //#region [ helpers ]
  private getActionOrNull(eventName: ActEventName): ActMasterAction | null {
    return this._actions.get(eventName) || null;
  }
  //#endregion

  // #region [ plugin ]
  setAutoUnsubscribeCallback(
    autoUnsubscribeCallback: (...args: any[]) => void
  ) {
    if (typeof autoUnsubscribeCallback === 'function') {
      this.config.autoUnsubscribeCallback = autoUnsubscribeCallback;
    }
  }

  private onAction: OnAction = () => null;

  addActionWatch(cb: OnAction) {
    this.onAction = cb;
  }
  // #endregion
}
