import Vue from 'vue';
import {
  ActMasterAction,
  VueActMasterOptions,
  listenerFunction,
  ActEventName,
} from './types';
import { debounce } from './utils/debounce';

/**
 *
 */
export class VueActMasterInstance {
  private readonly _actions: {
    [eventName: string]: ActMasterAction;
  } = {};

  private readonly listeners: {
    [eventName: string]: listenerFunction[];
  } = {};

  private readonly vueInstance: typeof Vue;

  private DIContainer: { [key: string]: any } = {};

  private readonly config = {
    errorOnReplaceAction: true,
  };

  private static instance: VueActMasterInstance;

  constructor(vue: typeof Vue, options: VueActMasterOptions = {}) {
    this.vueInstance = vue;

    if (VueActMasterInstance.instance) {
      return VueActMasterInstance.instance;
    }

    const { actions, errorOnReplaceAction } = options;

    if (actions) {
      this.addActions(actions);
    }

    if (typeof errorOnReplaceAction === 'boolean') {
      this.config.errorOnReplaceAction = errorOnReplaceAction;
    }

    VueActMasterInstance.instance = this;
  }

  async exec<T extends any>(
    eventName: ActEventName,
    ...args: any[]
  ): Promise<T> {
    const action = this.getActionOrFail(eventName);

    const data = await action.exec(...args);

    this.emit(eventName, data);

    return data as T;
  }

  addActions(actions: ActMasterAction[]) {
    if (Array.isArray(actions)) {
      actions.forEach((action: ActMasterAction) => {
        this.addAction(action.name, action);
      });
    }
  }

  addAction(eventName: string, action: ActMasterAction) {
    if (this.config.errorOnReplaceAction && this._actions[eventName]) {
      throw new Error(`actiion "${eventName}" already existing`);
    }

    if (action.useDI) {
      action.useDI(this.DIContainer);
    }

    if (action.useEmit && action.name) {
      action.useEmit(this.emit.bind(this));
    }

    this._actions[eventName] = action;

    return this;
  }

  removeAction(eventName: ActEventName) {
    if (!this._actions[eventName]) {
      throw new Error(`actiion "${eventName}" not found`);
    }

    delete this._actions[eventName];
  }

  subscribe(
    eventName: ActEventName,
    listener: listenerFunction,
    vueContext?: Vue
  ) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);

    if (vueContext) {
      vueContext.$once('hook:beforeDestroy', () => {
        this.unsubscribe(eventName, listener);
      });
    }

    return () => this.unsubscribe(eventName, listener);
  }

  unsubscribe(eventName: ActEventName, listener: listenerFunction): boolean {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      return false;
    }

    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }

    this.listeners[eventName] = listeners;

    return index > -1;
  }

  emit(eventName: string, value: any) {
    const action = this.getActionOrFail(eventName);

    debounce(
      () => {
        const data = action.transform ? action.transform(value) : value;
        const listeners = this.listeners[eventName];

        if (listeners) {
          listeners.forEach(listenerCallback => {
            listenerCallback(data);
          });
        }
      },
      action.debounceOfEmit,
      value,
      action.name
    );
  }

  private getActionOrFail(eventName: ActEventName) {
    const action = this._actions[eventName];

    if (!action) {
      throw new Error(`Can't find "${eventName}" action`);
    }

    return action;
  }

  clearDI() {
    this.DIContainer = {};
  }

  setDI(key: string, ctx: any) {
    this.DIContainer[key] = ctx;
    this.freshEmitDI();
  }

  private freshEmitDI() {
    let action: any;
    for (const k in this._actions) {
      if (Object.prototype.hasOwnProperty.call(this._actions, k)) {
        action = this._actions[k];

        if (action.useDI) {
          action.useDI(this.DIContainer);
        }
      }
    }
  }
}
