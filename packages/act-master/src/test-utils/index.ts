import { ActEventName, ActMaster } from '../act-master';
import { CancelledAct } from '../cancelled';
import {
  ActExec,
  ActMasterAction,
  ActMasterOptions,
  ListenerFunction,
} from '../types';

export class ActTest {
  private static $act: ActMaster;
  private static _lastResult: any;

  private constructor() {
    //
  }

  static getInstance(options: ActMasterOptions = {}): ActMaster {
    ActTest.resetAll();
    ActTest.removeSingleton();
    ActTest.$act = new ActMaster(options);
    return ActTest.$act;
  }

  static setInstance(actMaster: ActMaster) {
    ActTest.$act = actMaster;
  }

  static checkInstance(actMaster: ActMaster) {
    return ActTest.$act === actMaster;
  }

  static resetAll(): void {
    if (ActTest.$act) {
      ActTest.$act.clearActions();
      ActTest.$act.clearListeners();
      ActTest.$act.clearDI();
    }
    ActTest._lastResult = undefined;
  }

  static removeSingleton() {
    //@ts-ignore
    ActMaster.instance = undefined;
    ActTest._lastResult = undefined;
  }

  static addActions(actions: ActMasterAction[]): void {
    if (!ActTest.$act) {
      ActTest.getInstance();
    }

    ActTest.$act.addActions(actions);
  }

  static exec: ActExec = (eventName, ...args) => {
    return ActTest.$act
      .exec(eventName, ...args)
      .then((data) => {
        ActTest._lastResult = data;
        return data;
      })
      .catch((err) => {
        ActTest._lastResult = err;
        throw err;
      });
  };

  static subscribe(
    eventName: ActEventName,
    listener: ListenerFunction,
    context?: any
  ): () => boolean {
    return ActTest.$act.subscribe(eventName, listener, context);
  }

  static entityCount(key: 'actions' | 'watchers' | 'listeners' | 'di'): number {
    if (key === 'di') {
      //@ts-ignore
      return Object.keys(ActTest.$act._DIContainer).length;
    }

    if (key === 'actions') {
      //@ts-ignore
      return ActTest.$act._actions.size;
    }

    const map = {
      watchers: '_watchers',
      listeners: '_listeners',
    } as const;

    const propName = map[key];

    let count = 0;

    ActTest.$act[propName].forEach((val) => {
      count += val.length;
    });

    return count;
  }

  static getLastResult(): any {
    return ActTest._lastResult;
  }

  static makeActionStub(action?: Partial<ActMasterAction>): ActMasterAction {
    const act = {
      name: `Act_${Math.random()}`,
      exec: () => null,
      ...action,
    };

    return act;
  }
}
