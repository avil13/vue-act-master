import Vue from 'vue';

import {
  ActMasterAction,
  VueActMasterOptions,
  listenerFunction,
  ActEventName,
  ActMasterActionDevDI,
} from './types';

import { debounce } from './utils/debounce';

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

  private readonly vueInstance: typeof Vue;

  private _DIContainer: { [key: string]: any } = {};

  private readonly config = {
    errorOnReplaceAction: true,
  };

  private static instance: ActMaster;

  constructor(vue: typeof Vue, options: VueActMasterOptions = {}) {
    this.vueInstance = vue;

    if (ActMaster.instance) {
      return ActMaster.instance;
    }

    const { actions, errorOnReplaceAction } = options;

    if (actions) {
      this.addActions(actions);
    }

    if (typeof errorOnReplaceAction === 'boolean') {
      this.config.errorOnReplaceAction = errorOnReplaceAction;
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
  async exec<T extends any>(
    eventName: ActEventName,
    ...args: any[]
  ): Promise<T> {
    const action = this.getActionOrFail(eventName);

    const execResult = await action.exec(...args);

    if (!action.useEmit) {
      this.emit(eventName, execResult);
    }

    const data = action.transform ? action.transform(execResult) : execResult;
    return data as T;
  }

  emit(eventName: string, execResult: any): void {
    const action = this.getActionOrFail(eventName);
    const value = action.transform ? action.transform(execResult) : execResult;

    debounce(
      () => {
        const listeners = this._listeners[eventName];

        if (listeners) {
          listeners.forEach((listenerCallback) => {
            listenerCallback(value);
          });
        }
      },
      action.debounceOfEmit,
      value,
      action.name
    );
  }
  //#endregion

  //#region [ Subscribtions ]
  subscribe(
    eventName: ActEventName,
    listener: listenerFunction,
    vueContext?: Vue
  ): () => boolean {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }
    this._listeners[eventName].push(listener);

    if (vueContext) {
      vueContext.$once('hook:beforeDestroy', () => {
        this.unsubscribe(eventName, listener);
      });
    }

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
    if (action.__UseDI__) {
      action.__UseDI__(this._DIContainer);
    }

    if (action.UseDI) {
      action.UseDI(this._DIContainer);
    }
  }
  //#endregion

  //#region [ helpers ]
  private getActionOrFail(eventName: ActEventName) {
    const action = this._actions[eventName];

    if (!action) {
      throw new Error(`Can't find "${eventName}" action`);
    }

    return action;
  }
  //#endregion
}
