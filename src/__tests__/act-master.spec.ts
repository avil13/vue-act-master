import Vue from 'vue';
import { ActMaster } from '../act-master';

describe('VueActMaster', () => {
  let ACTION_NAME: string;
  let $act: ActMaster;
  let expectRandomValue: string;

  const addTestAction = (name: string, extendObj = {}) => {
    $act.addActions([
      {
        name,
        exec: jest.fn(() => expectRandomValue),
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

    const vueInstance = {} as typeof Vue;

    $act = new ActMaster(vueInstance);
  });

  // tests
  describe('Actions', () => {
    it('addActions', async () => {
      ACTION_NAME = 'ACTION_NAME_ACT';

      addTestAction(ACTION_NAME);

      //@ts-ignore
      expect($act.getActionOrFail(ACTION_NAME)).toBeTruthy();
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

    it('transform', async () => {
      ACTION_NAME = 'ACTION_NAME_EX';

      addTestAction(ACTION_NAME, {
        transform: (v) => `${v}_SUFFIX`,
      });

      const result = await $act.exec(ACTION_NAME);
      expect(result).toBe(`${expectRandomValue}_SUFFIX`);
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

    it('unsubscribe auto', async () => {
      ACTION_NAME = 'ACTION_NAME_UN_AUTO';

      addTestAction(ACTION_NAME);

      const mockCallback = jest.fn();
      const vueComp = { $once: mockCallback };

      //@ts-ignore
      $act.subscribe(ACTION_NAME, () => ({}), vueComp);

      // ...destroy component
      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toBe('hook:beforeDestroy');
    });
  });

  describe('DI', () => {
    it('DI same entity', async () => {
      ACTION_NAME = 'ACTION_NAME_DI';
      const DATA = Math.random();
      const mockCallback = jest.fn();

      $act.setDI('api', mockCallback);

      addTestAction(ACTION_NAME, {
        exec(data) {
          this.api(data);
        },
        useDI({ api }) {
          this.api = api;
        },
      });

      await $act.exec(ACTION_NAME, DATA);

      expect(mockCallback.mock.calls.length).toBe(1);
      expect(mockCallback.mock.calls[0][0]).toBe(DATA);
    });
  });
});
