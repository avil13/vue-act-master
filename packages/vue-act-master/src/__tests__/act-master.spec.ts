import { ActMaster } from '..';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VueActMaster } from '..';

//#region [ emulate Vue install ]

const vueMock = function () {
  return;
};
//@ts-ignore
VueActMaster.install(vueMock);
//@ts-ignore
const $act: ActMaster = vueMock.act;
//#endregion

describe('VueActMaster', () => {
  let ACTION_NAME: string;
  let expectRandomValue: string;

  const addTestAction = (name: string, extendObj = {}) => {
    $act.addActions([
      {
        name,
        exec: vi.fn(() => expectRandomValue),
        ...extendObj,
      },
    ]);
  };

  beforeEach(() => {
    if ($act) {
      $act.clearActions();
      $act.clearListeners();
      $act.clearDI();
    }

    expectRandomValue = `${Math.random() * 1000}`;
  });

  // tests
  describe('Actions', () => {
    it('addActions', async () => {
      ACTION_NAME = 'ACTION_NAME_ACT';

      addTestAction(ACTION_NAME);

      //@ts-ignore
      expect($act.getActionOrNull(ACTION_NAME)).toBeTruthy();
    });

    it('remove action', async () => {
      ACTION_NAME = 'ACTION_NAME_RM';

      addTestAction(ACTION_NAME);

      const result = await $act.exec(ACTION_NAME);
      expect(result).toBe(expectRandomValue);

      $act.removeAction(ACTION_NAME);
      expect($act.exec(ACTION_NAME)).rejects.toThrow();
    });
  });

  describe('Executions', () => {
    it('exec', async () => {
      ACTION_NAME = 'ACTION_NAME_EX';

      addTestAction(ACTION_NAME);

      const result = await $act.exec(ACTION_NAME);
      expect(result).toBe(expectRandomValue);
    });
  });

  describe('Subscriptions', () => {
    it('subscribe', async () => {
      ACTION_NAME = 'ACTION_NAME_SUB';

      addTestAction(ACTION_NAME);
      //

      let subscribedData: any;

      $act.subscribe(ACTION_NAME, (data) => {
        subscribedData = data;
      });

      const result = await $act.exec(ACTION_NAME);
      expect(result).toBe(subscribedData);
    });

    it('unsubscribe', async () => {
      ACTION_NAME = 'ACTION_NAME_UN';

      addTestAction(ACTION_NAME);
      //
      let subscribedData: any;

      const unsubscribe = $act.subscribe(ACTION_NAME, (data) => {
        subscribedData = data;
      });

      let result;
      result = await $act.exec(ACTION_NAME);
      expect(result).toBe(subscribedData);

      unsubscribe();
      subscribedData = null;

      result = await $act.exec(ACTION_NAME);
      expect(result).not.toBe(subscribedData);
    });

    it.skip('unsubscribe auto', async () => {
      ACTION_NAME = 'ACTION_NAME_UN_AUTO';

      addTestAction(ACTION_NAME);

      const mockCallback = vi.fn();
      const vueComp = { $once: mockCallback };

      //@ts-ignore
      $act.subscribe(ACTION_NAME, () => ({}), vueComp);

      // ...destroy component
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toBe('hook:beforeDestroy');
    });
  });
});
