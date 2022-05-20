import { CancelledAct } from './cancelled';
import {
  ActinonAlreadyExistingError,
  InvalidDITypeError,
  KeyAlreadyExistsInDIError,
  NotFoundActionError,
} from './errors';
import {
  ActMasterAction,
  ActMasterActionDevDI,
  ActMasterOptions,
  devActMasterConfig,
  DIMap,
  ListenerFunction,
} from './types';

//@ts-ignore
import { version } from '../package.json';

export * from './errors';
export * from './types';
export * from './decorators/index';
export { CancelledAct };

export type ActEventName = string;

/**
 * @deprecated use EmitAction
 */
export type emitAction = EmitAction;

export type EmitAction = ActMaster['exec'];
/**
 *
 */
export class ActMaster {
  readonly version = version;

  private readonly _actions = new Map<ActEventName, ActMasterAction>();

  private readonly _watchers = new Map<ActEventName, ActEventName[]>();

  private readonly _listeners = new Map<ActEventName, ListenerFunction[]>();

  private readonly _inProgressWatchers = new Map<
    ActEventName,
    (inProgress: boolean) => void
  >();

  private readonly _subsMap = new Map<any, (() => void)[]>();

  private _lastUnsubscribe: () => any = () => false;

  private _DIContainer: DIMap = {};

  private readonly _singlePromisesStore = new Map<
    ActEventName,
    Promise<any | CancelledAct>
  >();

  private readonly config: devActMasterConfig = {
    errorOnReplaceAction: true,
    errorOnReplaceDI: false,
    errorOnEmptyAction: true,
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
      errorOnReplaceAction,
      errorOnReplaceDI,
      errorOnEmptyAction,
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

    if (typeof errorOnReplaceAction === 'boolean') {
      this.config.errorOnReplaceAction = errorOnReplaceAction;
    }

    if (typeof errorOnEmptyAction === 'boolean') {
      this.config.errorOnEmptyAction = errorOnEmptyAction;
    }

    if (typeof errorOnReplaceDI === 'boolean') {
      this.config.errorOnReplaceDI = errorOnReplaceDI;
    }

    if (typeof errorHandlerEventName === 'string') {
      this.config.errorHandlerEventName = errorHandlerEventName;
    }

    ActMaster.instance = this;
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

    if (this.config.errorOnReplaceAction && this._actions.has(eventName)) {
      throw new ActinonAlreadyExistingError(eventName);
    }

    if (action.useEmit && action.name) {
      const bindedEmitter: EmitAction = async (
        eventName: ActEventName,
        ...args
      ) => {
        if (action.name === eventName) {
          return this.notifyListeners(eventName, args[0]) as any; // TODO: remove any
        }
        return this.emit(eventName, ...args);
      };
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
  async exec<T = any>(eventName: string, ...args: any[]): Promise<T | null> {
    this.setProgress(eventName, true);

    if (this._singlePromisesStore.has(eventName)) {
      const promise: Promise<T> | undefined =
        this._singlePromisesStore.get(eventName);

      if (promise) {
        return promise;
      }
    }

    const promise = this.emit<T>(eventName, ...args)
      .then((data) => {
        this.setProgress(eventName, false);
        return data;
      })
      .then((result) => {
        if (this._singlePromisesStore.has(eventName)) {
          this._singlePromisesStore.delete(eventName);
        }
        return result;
      })
      .catch((error: Error) => {
        this.setProgress(eventName, false);
        const action = this.getActionOrNull(eventName);

        if (
          action?.errorHandlerEventName &&
          action.errorHandlerEventName !== eventName
        ) {
          this.emit(action.errorHandlerEventName, error);
          throw new CancelledAct(error);
        }

        if (
          this.config.errorHandlerEventName &&
          this.config.errorHandlerEventName !== eventName
        ) {
          this.emit(this.config.errorHandlerEventName, error);
          return Promise.resolve(null);
        }

        throw error;
      });

    const action = this.getActionOrNull(eventName);

    if (action && action.isSingleExec) {
      this._singlePromisesStore.set(eventName, promise);
    }

    return promise;
  }

  private async emit<T2>(eventName: ActEventName, ...args: any[]): Promise<T2> {
    const action = this.getActionOrNull(eventName);

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

        return isValidOrError;
      }
    }

    const execResult = await action.exec(...args);

    if (execResult instanceof CancelledAct) {
      //@ts-ignore
      return execResult;
    }

    const value: T2 = action.transform
      ? await action.transform(execResult)
      : execResult;

    this.notifyListeners(eventName, value);

    if (!(value instanceof CancelledAct) && this._watchers.has(eventName)) {
      for (const watchingEventName of this._watchers.get(eventName) || []) {
        await this.emit(watchingEventName, value);
      }
    }

    return value;
  }

  private notifyListeners(eventName: ActEventName, value: any): void {
    const listeners = this._listeners.get(eventName);

    if (listeners) {
      listeners.forEach((listenerCallback) => {
        listenerCallback(value);
      });
    }
  }
  //#endregion

  //#region [ Subscribing ]
  subscribe(
    eventName: ActEventName,
    listener: ListenerFunction,
    context?: any
  ): () => boolean {
    this._listeners.set(eventName, [
      ...(this._listeners.get(eventName) || []),
      listener,
    ]);

    if (this.config.autoUnsubscribeCallback) {
      this.config.autoUnsubscribeCallback({
        context,
        listener,
        eventName,
      });
    }

    const unsubscribe = () => this.unsubscribe(eventName, listener);

    this._lastUnsubscribe = unsubscribe;

    return unsubscribe;
  }

  unsubscribe(eventName: ActEventName, listener: ListenerFunction): boolean {
    const listeners = this._listeners.get(eventName);
    if (!listeners) {
      return false;
    }

    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }

    this._listeners.set(eventName, listeners);

    return index > -1;
  }

  once(eventName: ActEventName, listener: ListenerFunction): () => boolean {
    const unsubscribe = this.subscribe(eventName, (...args) => {
      unsubscribe();
      listener(...args);
    });
    return unsubscribe;
  }

  on(
    eventName: ActEventName,
    listener: ListenerFunction,
    context?: any
  ): () => boolean {
    return this.subscribe(eventName, listener, context);
  }

  off(eventName: ActEventName, listener: ListenerFunction): boolean {
    return this.unsubscribe(eventName, listener);
  }
  //#endregion

  //#region [ extends functions ]
  inProgress(
    key: ActEventName | ActEventName[],
    callback: (inProgress: boolean) => void
  ): () => any {
    if (Array.isArray(key)) {
      key.forEach((k) => this._inProgressWatchers.set(k, callback));

      const unsubscribe = () => {
        key.forEach((k) => {
          this._inProgressWatchers.delete(k);
        });
      };

      this._lastUnsubscribe = unsubscribe;

      return unsubscribe;
    }

    this._inProgressWatchers.set(key, callback);

    const unsubscribe = () => this._inProgressWatchers.delete(key);

    this._lastUnsubscribe = unsubscribe;

    return unsubscribe;
  }

  private setProgress(key: ActEventName, status: boolean) {
    if (this._inProgressWatchers.has(key)) {
      //@ts-ignore
      this._inProgressWatchers.get(key)(status);
    }
  }

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
    if (action._DI_CONTAINER_) {
      action._DI_CONTAINER_ = this._DIContainer;
    }

    if (action.useDI) {
      action.useDI(this._DIContainer);
    }
  }
  //#endregion

  //#region [ helpers ]
  private getActionOrNull(eventName: ActEventName): ActMasterAction | null {
    const action = this._actions.get(eventName);

    if (!action && !this.config.errorOnEmptyAction) {
      return {
        name: '',
        exec: (data) => data,
      };
    }

    return action || null;
  }
  //#endregion
}
