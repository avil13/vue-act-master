import { ActMaster } from '../act-master';
import { CancelledAct } from '../cancelled';
import {
  ActEventName,
  ActMasterAction,
  ActMasterOptions,
  listenerFunction,
} from '../types';

export class ActTest {
  private static $act: ActMaster;
  private static _lastResult: any;

  static getInstance(options: ActMasterOptions = {}): ActMaster {
    if (options || !ActTest.$act) {
      ActTest.removeSingleton();
      ActTest.$act = new ActMaster(options);
    }
    return ActTest.$act;
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
    ActTest.$act.addActions(actions);
  }

  static exec<T = any>(
    eventName: ActEventName,
    ...args: any[]
  ): Promise<T | CancelledAct> {
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
  }

  static subscribe(
    eventName: ActEventName,
    listener: listenerFunction,
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
      name: `${Math.random()}`,
      exec: () => null,
      ...action,
    };

    return act;
  }
}
