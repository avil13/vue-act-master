import { ActMaster, ActMasterOptions, ActSubscribeType } from '../act-master';

act.init = (options: ActMasterOptions) => new ActMaster(options);

// #region [ subscribe ]
export const actSubscribe: ActSubscribeType = (
  eventName,
  listener,
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
