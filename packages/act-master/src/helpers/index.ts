import {
  ActEventName,
  ActMaster,
  ActMasterAction,
  EmitAction,
  ListenerFunction,
} from '../act-master';

// #region [ exec ]
export const exec: EmitAction = (eventName: ActEventName, ...args: any[]) =>
  act().exec(eventName, ...args);

act.exec = exec;
// #endregion

// #region [ addActions ]
export const addActions = (actions: ActMasterAction[]): void =>
  act().addActions(actions);

act.addActions = addActions;
// #endregion

// #region [ subscribe ]
export const subscribe = (
  eventName: ActEventName,
  listener: ListenerFunction,
  destroyHookOrKey?: any
): (() => boolean) => {
  const off = act().subscribe(eventName, listener);

  if (destroyHookOrKey) {
    if (typeof destroyHookOrKey === 'function') {
      destroyHookOrKey(off);
    } else {
      act().subsList.add(destroyHookOrKey, off);
    }
  }
  return off;
};

export const actSubscribe = subscribe;

act.subscribe = subscribe;
act.on = subscribe;
// #endregion

// #region [ subList.clear ]
export const subListClear = (key: any) => {
  return act().subsList.clear(key);
};

act.subListClear = subListClear;
// #endregion

/**
 * ActMaster instance and libs
 *
 * @returns ActMaster
 */
export function act(): ActMaster {
  //@ts-ignore
  const $act = ActMaster.instance;
  if (!$act) {
    throw new Error(
      'Instance call before initialization. Make a "new ActMaster()" first'
    );
  }
  return $act;
}
