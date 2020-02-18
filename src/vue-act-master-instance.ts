import Vue from 'vue';
import { ActMasterAction, VueActMasterOptions } from './types';

export class VueActMasterInstance {
  private actions: {
    [eventType: string]: ActMasterAction;
  } = {};

  private listeners: {
    [eventType: string]: ((...args: any[]) => any)[];
  } = {};

  private vueInstance: Vue;

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

    let value = action.exec.call(this.vueInstance, ...args);

    if (value instanceof Promise) {
      value = await value;
    }

    let data = action.transform ? new action.transform(value) : value;

    if (data instanceof Promise) {
      data = await data;
    }

    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(func => {
        func({
          eventType,
          value,
          data,
        });
      });
    }

    return value;
  }

  subscribe(eventType: string, listener: (...args: any[]) => any) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(listener);

    return () => this.unsubscribe(eventType, listener);
  }

  unsubscribe(eventType: string, listener: (...args: any[]) => any) {
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
