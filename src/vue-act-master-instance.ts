import Vue from 'vue';
import { ActMasterAction, VueActMasterOptions } from './types';

type listenerFunction = (...args: any[]) => any;

export class VueActMasterInstance {
  private readonly actions: {
    [eventType: string]: ActMasterAction;
  } = {};

  private readonly listeners: {
    [eventType: string]: listenerFunction[];
  } = {};

  private readonly vueInstance: Vue;

  constructor(vue: Vue, options: VueActMasterOptions) {
    this.vueInstance = vue;

    const { actions } = options;
    let item: any;

    for (const k in actions) {
      if (Object.prototype.hasOwnProperty.call(actions, k)) {
        item = new actions[k]();
        this.actions[item.name] = item;
      }
    }
  }

  async exec(eventType: string, ...args: any[]) {
    const action = this.actions[eventType];

    if (!action) {
      throw new Error(`Can't find "${eventType}" action`);
    }

    const value = await action.exec.call(this.vueInstance, ...args);
    const data = action.transform ? await action.transform(value) : value;

    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(func => {
        func({ eventType, value, data });
      });
    }

    return value;
  }

  subscribe(eventType: string, listener: listenerFunction) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(listener);

    return () => this.unsubscribe(eventType, listener);
  }

  unsubscribe(eventType: string, listener: listenerFunction) {
    const listeners = this.listeners[eventType];
    if (!listeners) {
      return -1;
    }

    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }

    this.listeners[eventType] = listeners;

    return index;
  }
}
