import { ActMaster, ActMasterAction, UseDI } from 'act-master';

describe('DI', () => {
  const ACTION_NAME = 'ACTION_NAME_DI';
  let $act: ActMaster;

  beforeEach(() => {
    if ($act) {
      $act.clearActions();
      $act.clearListeners();
      $act.clearDI();
    }

    $act = new ActMaster();
  });

  it('DI same entity', async () => {
    const DATA = Math.random();
    const mockCallback = jest.fn();

    $act.setDI('api', mockCallback);

    $act.addActions([
      {
        name: ACTION_NAME,
        exec(data) {
          this.api(data);
        },
        useDI({ api }: any) {
          this.api = api;
        },
      },
    ]);

    await $act.exec(ACTION_NAME, DATA);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(DATA);
  });

  it('decorator UseDI test', async () => {
    const DATA_FOR_API = Math.random();
    const DATA_FOR_STORE = 'DATA_FOR_STORE';

    const mockApiCallback = jest.fn();
    const mockStoreCallback = jest.fn();

    $act.setDI('api', mockApiCallback);
    $act.setDI('store', mockStoreCallback);

    class TestActionClass implements ActMasterAction {
      name = ACTION_NAME;

      @UseDI('api')
      selfApi!: jest.Mock;

      @UseDI('store')
      selfStore!: jest.Mock;

      exec(data1: number, data2: string) {
        this.selfApi(data1);
        this.selfStore(data2);
      }
    }

    const testActionClass = new TestActionClass();

    $act.addActions([testActionClass]);

    await $act.exec(ACTION_NAME, DATA_FOR_API, DATA_FOR_STORE);

    // expect(mockApiCallback.mock.calls.length).toBe(1);
    // expect(mockApiCallback.mock.calls[0][0]).toBe(DATA_FOR_API);

    // expect(mockStoreCallback.mock.calls.length).toBe(1);
    // expect(mockStoreCallback.mock.calls[0][0]).toBe(DATA_FOR_STORE);
  });
});
