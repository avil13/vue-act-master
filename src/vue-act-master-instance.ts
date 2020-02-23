import Vue from 'vue';
import {
  ActMasterAction,
  VueActMasterOptions,
  ActMasterActions,
  listenerFunction,
} from './types';

export class VueActMasterInstance {
  private readonly actions: {
    [eventName: string]: ActMasterAction;
  } = {};

  private readonly listeners: {
    [eventName: string]: listenerFunction[];
  } = {};

  private readonly vueInstance: Vue;

  constructor(vue: Vue, options: VueActMasterOptions) {
    this.vueInstance = vue;

    const { actions } = options;

    this.addActions(actions);
  }

  async exec(eventName: keyof VueActMasterInstance['actions'], ...args: any[]) {
    const action = this.actions[eventName];

    if (!action) {
      throw new Error(`Can't find "${eventName}" action`);
    }

    const value = await action.exec.call(this.vueInstance, ...args);
    const data = action.transform ? await action.transform(value) : value;

    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(listenerCallback => {
        listenerCallback({ eventName, value, data });
      });
    }

    return data;
  }

  addActions(actions: ActMasterActions) {
    for (const eventName in actions) {
      if (Object.prototype.hasOwnProperty.call(actions, eventName)) {
        this.addAction(eventName, actions[eventName]);
      }
    }
  }

  addAction(eventName: string, action: ActMasterAction) {
    if (this.actions[eventName]) {
      throw new Error(`actiion "${eventName}" already existing`);
    }
    this.actions[eventName] = action;
  }

  removeAction(eventName: string) {
    if (!this.actions[eventName]) {
      throw new Error(`actiion "${eventName}" not found`);
    }

    delete this.actions[eventName];
  }

  subscribe(eventName: string, listener: listenerFunction) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);

    return () => this.unsubscribe(eventName, listener);
  }

  unsubscribe(eventName: string, listener: listenerFunction) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      return -1;
    }

    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }

    this.listeners[eventName] = listeners;

    return index;
  }
}
