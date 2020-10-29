import { clearLine } from 'readline';
import { ActMaster } from '../act-master';
import { ActMasterAction } from '../types';

export const addTestActionFactory = ($act: ActMaster) => {
  return (extendObj: Partial<ActMasterAction> = {}) => {
    const eventName = `${Math.random() * 1000}`;
    const expectMockResult = `${Math.random() * 1000}`;
    const execMock = jest.fn(() => expectMockResult);

    $act.addActions([
      {
        name: eventName,
        exec: execMock,
        ...extendObj,
      },
    ]);
    return { eventName, expectMockResult, execMock };
  };
};

export const clearActMaster = ($act?: ActMaster): void => {
  if ($act) {
    $act.clearActions();
    $act.clearListeners();
    $act.clearDI();
  }
};

export const removeSingleton = () => {
  //@ts-ignore
  ActMaster.instance = undefined;
};

export const entityCount = (
  $act: ActMaster,
  key: 'actions' | 'waiters' | 'listeners' | 'di'
): number => {
  const map = {
    actions: '_actions',
    waiters: '_waiters',
    listeners: '_listeners',
    di: '_DIContainer',
  };

  const propName = map[key];

  //@ts-ignore
  return Object.keys($act[propName]).length;
};
