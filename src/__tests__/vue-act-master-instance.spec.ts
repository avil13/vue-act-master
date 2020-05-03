import Vue from 'vue';
import { VueActMasterInstance } from '../vue-act-master-instance';

describe('VueActMasterInstance', () => {
  const ACTION_KEY = 'ACTION_KEY';
  const ACTION_TRANSFORMED_KEY = 'ACTION_TRANSFORMED_KEY';
  let $act: VueActMasterInstance;
  let execMethodMock: jest.Mock;
  let expectRandomValue: any;
  let transformedValue = 'transformed value';

  beforeEach(() => {
    expectRandomValue = Math.random().toString();
    execMethodMock = jest.fn();
    execMethodMock.mockReturnValue(expectRandomValue);

    const vueInstance = {} as typeof Vue;

    $act = new VueActMasterInstance(vueInstance, {
      actions: {
        [ACTION_KEY]: {
          exec: execMethodMock,
        },
        [ACTION_TRANSFORMED_KEY]: {
          exec: execMethodMock,
          transform(v: any) {
            transformedValue += v;
            return transformedValue;
          },
        },
      },
    });
  });

  it('exec simple', async () => {
    const result = await $act.exec(ACTION_KEY);
    expect(result).toEqual(expectRandomValue);
  });

  it('addActionName', async () => {
    const ACTION_KEY_2 = 'ACTION_KEY_2';
    const funcMock = jest.fn();
    funcMock.mockReturnValue(expectRandomValue);

    $act.addActionName(ACTION_KEY_2, { exec: funcMock });

    const result = await $act.exec(ACTION_KEY_2);

    expect(result).toEqual(expectRandomValue);
  });

  it('addAction', async () => {
    const ACTION_KEY_2 = 'ACTION_KEY_2';
    const funcMock = jest.fn();
    funcMock.mockReturnValue(expectRandomValue);

    $act.addAction({
      name: ACTION_KEY_2,
      exec: funcMock,
    });

    const result = await $act.exec(ACTION_KEY_2);

    expect(result).toEqual(expectRandomValue);
  });

  describe('addActions', () => {
    it('object actions', async () => {
      const ACTION_KEY_3 = 'ACTION_KEY_3';
      const funcMock = jest.fn();
      funcMock.mockReturnValue(expectRandomValue);

      $act.addActions({
        [ACTION_KEY_3]: { exec: funcMock },
      });

      const result = await $act.exec(ACTION_KEY_3);

      expect(result).toEqual(expectRandomValue);
    });

    it('array actions', async () => {
      const ACTION_KEY_3 = 'ACTION_KEY_3';
      const funcMock = jest.fn();
      funcMock.mockReturnValue(expectRandomValue);

      $act.addActions([{ name: ACTION_KEY_3, exec: funcMock }]);

      const result = await $act.exec(ACTION_KEY_3);

      expect(result).toEqual(expectRandomValue);
    });
  });

  it('remove action', async () => {
    const result1 = await $act.exec(ACTION_KEY);
    expect(result1).toEqual(expectRandomValue);

    $act.removeAction(ACTION_KEY);

    expect($act.exec(ACTION_KEY)).rejects.toThrow();
  });

  it('transform', async () => {
    const result = await $act.exec(ACTION_TRANSFORMED_KEY);
    expect(result).toEqual(transformedValue);
  });

  it('subscribe', async () => {
    let subscribedData: any;

    $act.subscribe(ACTION_TRANSFORMED_KEY, data => {
      subscribedData = data;
    });

    const result = await $act.exec(ACTION_TRANSFORMED_KEY);

    expect(result).toEqual(subscribedData);
  });

  it('unsubscribe', async () => {
    let subscribedValue: any;
    let subscribedData: any;

    const unsubscribe = $act.subscribe(
      ACTION_TRANSFORMED_KEY,
      ({ value, data }) => {
        subscribedValue = value;
        subscribedData = data;
      }
    );

    unsubscribe();

    const result = await $act.exec(ACTION_TRANSFORMED_KEY);

    expect(result).toEqual(transformedValue);
    expect(subscribedData).toEqual(undefined);
    expect(subscribedValue).toEqual(undefined);
  });
});
