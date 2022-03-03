import { vi } from 'vitest';

import { ActMaster } from '../act-master';
import { ActMasterAction } from '../types';

export const addTestActionFactory = ($act: ActMaster) => {
  return (extendObj: Partial<ActMasterAction> = {}) => {
    const eventName = `${Math.random() * 1000}`;
    const expectMockResult = `${Math.random() * 1000}`;
    const execMock = vi.fn(() => expectMockResult);

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
