import Vue from 'vue';
import {
  ActMasterAction,
  VueActMasterOptions,
  ActMasterActions,
  listenerFunction,
} from './types';
import { Saga } from './saga/saga';

type ActEventName = string;

export class VueActMasterInstance {
  private readonly actions: {
    [eventName: string]: ActMasterAction;
  } = {};

  private readonly listeners: {
    [eventName: string]: listenerFunction[];
  } = {};

  private readonly sagaInstance: Saga;

  private readonly vueInstance: typeof Vue;

  constructor(vue: typeof Vue, options: VueActMasterOptions = {}) {
    this.vueInstance = vue;
    this.sagaInstance = new Saga();

    const { actions } = options;

    if (actions) {
      this.addActions(actions);
    }
  }

  async exec(eventName: ActEventName, ...args: any[]) {
    if (this.sagaInstance.isPartOfSaga(eventName)) {
      this.sagaInstance.execSaga(eventName, async (event, sagaState) => {
        return await this.execute(event, sagaState, ...args);
      });
    } else {
      return this.execute(eventName, ...args);
    }
  }

  private async execute(eventName: ActEventName, ...args: any[]) {
    const action = this.actions[eventName];

    if (!action) {
      throw new Error(`Can't find "${eventName}" action`);
    }

    const value = await action.exec.apply(this.vueInstance, args);
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

    this.sagaInstance.addSaga(eventName, action);
  }

  removeAction(eventName: ActEventName) {
    if (!this.actions[eventName]) {
      throw new Error(`actiion "${eventName}" not found`);
    }

    this.sagaInstance.removeSaga(eventName);
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
}
