import {
  ActMasterAction,
  VueActMasterOptions,
  listenerFunction,
  ActEventName,
  ActMasterActionDevDI,
} from './types';
import { CancelledAct } from './canselled';

/**
 *
 */
export class ActMaster {
  private readonly _actions: {
    [eventName: string]: ActMasterAction;
  } = {};

  private readonly _listeners: {
    [eventName: string]: listenerFunction[];
  } = {};

  private _DIContainer: { [key: string]: any } = {};

  private readonly config = {
    errorOnReplaceAction: true,
    errorOnEmptyAction: true,
  };

  private static instance: ActMaster;

  constructor(options: VueActMasterOptions = {}) {
    if (ActMaster.instance) {
      return ActMaster.instance;
    }

    const { actions, errorOnReplaceAction, errorOnEmptyAction } = options;

    if (actions) {
      this.addActions(actions);
    }

    if (typeof errorOnReplaceAction === 'boolean') {
      this.config.errorOnReplaceAction = errorOnReplaceAction;
    }

    if (typeof errorOnEmptyAction === 'boolean') {
      this.config.errorOnEmptyAction = errorOnEmptyAction;
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

  addAction(eventName: string, action: ActMasterAction): ActMaster {
    if (this.config.errorOnReplaceAction && this._actions[eventName]) {
      throw new Error(`actiion "${eventName}" already existing`);
    }

    if (action.useEmit && action.name) {
      action.useEmit(this.emit.bind(this));
    }

    if (action._EMITTER_ === null) {
      action._EMITTER_ = this.emit.bind(this);
    }

    this._actions[eventName] = action;

    this.emitDIProps(action);

    return this;
  }

  removeAction(eventName: ActEventName): void {
    if (!this._actions[eventName]) {
      throw new Error(`actiion "${eventName}" not found`);
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
      if (Object.prototype.hasOwnProperty.call(this._listeners, eventName)) {
        delete this._listeners[eventName];
      }
    }
  }
  //#endregion

  //#region [ Executions ]
  async exec<T = any>(eventName: ActEventName, ...args: any[]): Promise<T> {
    return await this.emit<T>(eventName, ...args);
  }

  async emit<T2>(eventName: string, ...args: any[]): Promise<T2> {
    const action = this.getActionOrFail(eventName);
    const execResult = await action.exec(...args);
    const value: T2 = action.transform
      ? action.transform(execResult)
      : execResult;
    const listeners = this._listeners[eventName];

    if (listeners) {
      listeners.forEach((listenerCallback) => {
        listenerCallback(value);
      });
    }

    return value;
  }
  //#endregion

  //#region [ Subscribtions ]
  subscribe(
    eventName: ActEventName,
    listener: listenerFunction
  ): () => boolean {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }
    this._listeners[eventName].push(listener);

    return () => this.unsubscribe(eventName, listener);
  }

  unsubscribe(eventName: ActEventName, listener: listenerFunction): boolean {
    const listeners = this._listeners[eventName];
    if (!listeners) {
      return false;
    }

    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }

    this._listeners[eventName] = listeners;

    return index > -1;
  }
  //#endregion

  //#region [ DI ]
  clearDI(): void {
    this._DIContainer = {};
  }

  setDI(key: string, ctx: any): ActMaster {
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
  private getActionOrFail(eventName: ActEventName): ActMasterAction {
    const action = this._actions[eventName];

    if (!action) {
      if (this.config.errorOnEmptyAction) {
        throw new Error(`Can't find "${eventName}" action`);
      }
      return {
        name: '',
        exec: (data) => data
      };
    }

    return action;
  }
  //#endregion
}
