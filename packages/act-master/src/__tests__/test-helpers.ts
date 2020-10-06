import { ActMaster } from '../act-master';
import { ActMasterAction } from '../types';

export const addTestActionFactory = ($act: ActMaster) => {
  return (extendObj: Partial<ActMasterAction> = {}) => {
    const eventName = `${Math.random() * 1000}`;
    const expectRandomValue = `${Math.random() * 1000}`;

    $act.addActions([
      {
        name: eventName,
        exec: jest.fn(() => expectRandomValue),
        ...extendObj,
      },
    ]);
    return { eventName, expectRandomValue };
  };
}

export const createTestActionFactory = ($act: ActMaster) => {
  return (extendObj: Partial<ActMasterAction> = {}) => {
    const eventName = `${Math.random() * 1000}`;
    const expectRandomValue = `${Math.random() * 1000}`;

    $act.addActions([
      {
        name: eventName,
        exec: jest.fn(() => expectRandomValue),
        ...extendObj,
      },
    ]);
    return { eventName, expectRandomValue };
  };
}

export const clearActMaster = ($act?: ActMaster): void => {
  if ($act) {
    $act.clearActions();
    $act.clearListeners();
    $act.clearDI();
  }
}
