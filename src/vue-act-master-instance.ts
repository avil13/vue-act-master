import Vue from 'vue';
import {
  ActMasterAction,
  VueActMasterOptions,
  ActMasterActions,
  listenerFunction,
  ActMasterActionNamed,
  ActEventName,
} from './types';

/**
 *
 */
export class VueActMasterInstance {
  private readonly actions: {
    [eventName: string]: ActMasterAction;
  } = {};

  private readonly listeners: {
    [eventName: string]: listenerFunction[];
  } = {};

  private readonly vueInstance: typeof Vue;

  private globalStates: { [key: string]: any } = {};

  private readonly config = {
    errorOnReplaceAction: true,
  };

  constructor(vue: typeof Vue, options: VueActMasterOptions = {}) {
    this.vueInstance = vue;

    const { actions, errorOnReplaceAction } = options;

    if (actions) {
      this.addActions(actions);
    }

    if (typeof errorOnReplaceAction === 'boolean') {
      this.config.errorOnReplaceAction = errorOnReplaceAction;
    }
  }

  async exec(eventName: ActEventName, ...args: any[]) {
    const action = this.actions[eventName];

    if (!action) {
      throw new Error(`Can't find "${eventName}" action`);
    }

    const value = await action.exec(...args);
    const data = action.transform ? await action.transform(value) : value;

    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(listenerCallback => {
        listenerCallback({ eventName, value, data });
      });
    }

    return data;
  }

  addActions(actions: ActMasterActions | ActMasterActionNamed[]) {
    if (Array.isArray(actions)) {
      actions.forEach((action: ActMasterActionNamed) => {
        this.addAction(action);
      });
    } else {
      for (const eventName in actions) {
        if (Object.prototype.hasOwnProperty.call(actions, eventName)) {
          this.addActionName(eventName, actions[eventName]);
        }
      }
    }
  }

  addAction(action: ActMasterActionNamed) {
    return this.addActionName(action.name, action);
  }

  addActionName(eventName: string, action: ActMasterAction) {
    if (this.config.errorOnReplaceAction && this.actions[eventName]) {
      throw new Error(`actiion "${eventName}" already existing`);
    }

    if (action.useVue) {
      //@ts-ignore
      action.useVue(this.vueInstance);
    }

    if (action.useStates) {
      //@ts-ignore
      action.useStates(this.globalStates);
    }

    this.actions[eventName] = action;

    return this;
  }

  removeAction(eventName: ActEventName) {
    if (!this.actions[eventName]) {
      throw new Error(`actiion "${eventName}" not found`);
    }

    delete this.actions[eventName];
  }

  subscribe(eventName: ActEventName, listener: listenerFunction) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);

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

  clearStates() {
    this.globalStates = {};
  }
}
