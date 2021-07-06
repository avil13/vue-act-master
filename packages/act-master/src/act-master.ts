import { CancelledAct } from './cancelled';
import {
  ActinonAlreadyExistingError,
  InvalidDITypeError,
  KeyAlreadyExistsInDIError,
  NotFoundActionError,
} from './errors';
import {
  ActEventName,
  ActMasterAction,
  ActMasterActionDevDI,
  ActMasterOptions,
  devActMasterConfig,
  DIMap,
  listenerFunction,
  listenersMap,
  waiterMap,
} from './types';

export * from './errors';
export * from './types';
export * from './decorators/index';
export { CancelledAct };

/**
 *
 */
export class ActMaster {
  private readonly _actions: {
    [eventName: string]: ActMasterAction;
  } = {};

  private readonly _waiters: waiterMap = new Map();

  private readonly _listeners: listenersMap = new Map();

  private _DIContainer: DIMap = {};

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
        this.addAction(action.name, action);
      });
    }
  }

  addAction(eventName: ActEventName, action: ActMasterAction): ActMaster {
    if (this.config.errorOnReplaceAction && this._actions[eventName]) {
      throw new ActinonAlreadyExistingError(eventName);
    }

    if (action.useEmit && action.name) {
      action.useEmit(this.emit.bind(this));
    }

    if (action._EMITTER_ === null) {
      action._EMITTER_ = this.emit.bind(this);
    }

    this._actions[eventName] = action;

    this.emitDIProps(action);

    if (action.wait) {
      action.wait.forEach((waitEventName) => {
        const waiters = this._waiters.get(waitEventName) || [];
        waiters.push(eventName);
        this._waiters.set(waitEventName, waiters);
      });
    }

    return this;
  }

  removeAction(eventName: ActEventName): void {
    if (!this._actions[eventName]) {
      throw new NotFoundActionError(eventName);
    }

    delete this._actions[eventName];
  }

  clearActions(): void {
    for (const eventName in this._actions) {
      if (Object.prototype.hasOwnProperty.call(this._actions, eventName)) {
        delete this._actions[eventName];
      }
    }
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
  async exec<T = any>(
    eventName: ActEventName,
    ...args: any[]
  ): Promise<T | CancelledAct> {
    return this.emit<T>(eventName, ...args).catch((error: Error) => {
      const action = this.getActionOrNull(eventName);

      if (
        action?.errorHandlerEventName &&
        action.errorHandlerEventName !== eventName
      ) {
        this.emit(action.errorHandlerEventName, error);
        return new CancelledAct(error.message);
      }

      if (
        this.config.errorHandlerEventName &&
        this.config.errorHandlerEventName !== eventName
      ) {
        this.emit(this.config.errorHandlerEventName, error);
        return new CancelledAct(error.message);
      }

      throw error;
    });
  }

  async emit<T2>(
    eventName: string,
    ...args: any[]
  ): Promise<T2 | CancelledAct> {
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
      return execResult;
    }

    const value: T2 = action.transform
      ? await action.transform(execResult)
      : execResult;
    const listeners = this._listeners.get(eventName);

    if (listeners) {
      listeners.forEach((listenerCallback) => {
        listenerCallback(value);
      });
    }

    if (!(value instanceof CancelledAct) && this._waiters.has(eventName)) {
      for (const waitingEventName of this._waiters.get(eventName) || []) {
        await this.emit(waitingEventName, value);
      }
    }

    return value;
  }
  //#endregion

  //#region [ Subscribtions ]
  subscribe(
    eventName: ActEventName,
    listener: listenerFunction,
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

    return () => this.unsubscribe(eventName, listener);
  }

  unsubscribe(eventName: ActEventName, listener: listenerFunction): boolean {
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

  once(eventName: ActEventName, listener: listenerFunction): () => boolean {
    const unsubscribe = this.subscribe(eventName, (...args) => {
      unsubscribe();
      listener(...args);
    });
    return unsubscribe;
  }

  on(
    eventName: ActEventName,
    listener: listenerFunction,
    context?: any
  ): () => boolean {
    return this.subscribe(eventName, listener, context);
  }

  off(eventName: ActEventName, listener: listenerFunction): boolean {
    return this.unsubscribe(eventName, listener);
  }
  //#endregion

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
    let action: any;
    for (const k in this._actions) {
      if (Object.prototype.hasOwnProperty.call(this._actions, k)) {
        action = this._actions[k];

        this.emitDIProps(action);
      }
    }
  }

  private emitDIProps(action: ActMasterActionDevDI) {
    if (action.__useDI__) {
      action.__useDI__(this._DIContainer);
    }

    if (action.useDI) {
      action.useDI(this._DIContainer);
    }
  }
  //#endregion

  //#region [ helpers ]
  private getActionOrNull(eventName: ActEventName): ActMasterAction | null {
    const action = this._actions[eventName];

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
