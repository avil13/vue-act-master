import { ActMaster } from '../act-master';
import { addTestActionFactory, clearActMaster } from './test-helpers';

const $act = new ActMaster();
const addTestAction = addTestActionFactory($act);

describe('ActMaster', () => {
  beforeEach(() => {
    clearActMaster($act)
  });

  // tests
  describe('Actions', () => {
    it('addActions', async () => {
      const { eventName } = addTestAction();

      //@ts-ignore
      expect($act.getActionOrFail(eventName)).toBeTruthy();
    });

    it('remove action', async () => {
      const { eventName, expectMockResult } = addTestAction();

      const result = await $act.exec(eventName);
      expect(result).toBe(expectMockResult);

      $act.removeAction(eventName);
      expect($act.exec(eventName)).rejects.toThrow();
    });
  });

  describe('Executions', () => {
    it('exec', async () => {
      const { eventName, expectMockResult } = addTestAction();

      const result = await $act.exec(eventName);
      expect(result).toBe(expectMockResult);
    });

    it('transform', async () => {
      const { eventName, expectMockResult } = addTestAction({
        transform: (v: string) => `${v}_SUFFIX`,
      });

      const result = await $act.exec(eventName);
      expect(result).toBe(`${expectMockResult}_SUFFIX`);
    });
  });

  describe('Subscriptions', () => {
    it('subscribe', async () => {
      const { eventName } = addTestAction();
      let subscribedData: any;

      $act.subscribe(eventName, (data) => {
        subscribedData = data;
      });

      const result = await $act.exec(eventName);
      expect(result).toBe(subscribedData);
    });

    it('unsubscribe', async () => {
      const { eventName } = addTestAction();
      let subscribedData: any;

      const unsubscribe = $act.subscribe(eventName, (data) => {
        subscribedData = data;
      });

      let result;
      result = await $act.exec(eventName);
      expect(result).toBe(subscribedData);

      unsubscribe();
      subscribedData = null;

      result = await $act.exec(eventName);
      expect(result).not.toBe(subscribedData);
    });
  });
});
