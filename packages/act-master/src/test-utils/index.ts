import {
  ActEventName,
  ActMaster,
  ActMasterAction,
  ActMasterOptions,
  CancelledAct,
  listenerFunction,
} from 'act-master';

export class ActTest {
  private static $act: ActMaster;
  private static _lastResult: any;

  static getInstance(options: ActMasterOptions = {}): ActMaster {
    if (options || !ActTest.$act) {
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

  static entityCount(key: 'actions' | 'waiters' | 'listeners' | 'di'): number {
    const map = {
      actions: '_actions',
      waiters: '_waiters',
      listeners: '_listeners',
      di: '_DIContainer',
    };

    const propName = map[key];

    //@ts-ignore
    return Object.keys(ActTest.$act[propName]).length;
  }

  static getLastResult(): any {
    return ActTest._lastResult;
  }
}
