import { beforeEach, describe, expect, it, SpyInstanceFn, vi } from 'vitest';
import { ActMaster } from '../act-master';
import { UseDI } from '../decorators';
import { ActMasterAction } from '../types';

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
    const mockCallback = vi.fn();

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

    const mockApiCallback = vi.fn();

    class TestActionClass implements ActMasterAction {
      name = ACTION_NAME;

      @UseDI('api')
      selfApi!: SpyInstanceFn<any[], any>;

      exec(data1: number) {
        this.selfApi(data1);
      }
    }

    const testActionClass = new TestActionClass();

    $act.addActions([testActionClass]);

    $act.setDI('api', mockApiCallback);

    await $act.exec(ACTION_NAME, DATA_FOR_API);

    expect(mockApiCallback.mock.calls.length).toBe(1);
    expect(mockApiCallback.mock.calls[0][0]).toBe(DATA_FOR_API);
  });
});
