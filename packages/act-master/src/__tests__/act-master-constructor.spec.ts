import { ActMaster, ActMasterOptions } from '..';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActTest } from '../test-utils';

let $act: ActMaster = ActTest.getInstance();

const init = (options: ActMasterOptions = {}) => {
  $act = ActTest.getInstance(options);
};

describe('ActMaster constructor options', () => {
  beforeEach(() => {
    ActTest.resetAll();
  });

  const exec = () => void 0;

  it('actions', () => {
    expect(ActTest.entityCount('actions')).toBe(0);

    init({
      actions: [
        {
          name: '1',
          exec,
        },
        {
          name: '2',
          exec,
        },
      ],
    });

    expect(ActTest.entityCount('actions')).toBe(2);
  });

  it('di', () => {
    expect(ActTest.entityCount('di')).toBe(0);

    init({
      di: {
        api: {},
        router: {},
        store: {},
      },
    });

    expect(ActTest.entityCount('di')).toBe(3);
  });

  it('errorOnReplaceDI', () => {
    init({
      di: {
        api: {},
      },
    });

    const run = () => $act.setDI('api', {});

    expect(run).toThrow();
  });

  it('autoUnsubscribeCallback', () => {
    const mockFn = vi.fn();

    init({
      autoUnsubscribeCallback: mockFn,
    });

    $act.subscribe('test', () => void 0);

    expect(mockFn).toBeCalledTimes(1);
  });

  it('errorHandlerEventName in constructor', async () => {
    const errorHandlerEventName = 'on_err';
    const mockFn = vi.fn(() => true);

    init({
      errorHandlerEventName,
      actions: [
        {
          name: errorHandlerEventName,
          exec: mockFn,
        },
      ],
    });

    // make error and skip the error
    await $act.exec('No_Emit_Call').catch(() => void 0);

    expect(mockFn).toBeCalledTimes(0);
  });

  it('errorHandlerEventName in constructor override by action', async () => {
    const errorHandlerEventName1 = 'on_err_1';
    const errorHandlerEventName2 = 'on_err_2';

    const mockFn1 = vi.fn(() => true);
    const mockFn2 = vi.fn(() => true);

    init({
      errorHandlerEventName: errorHandlerEventName1,
      actions: [
        {
          name: errorHandlerEventName1,
          exec: mockFn1,
        },
        {
          name: errorHandlerEventName2,
          exec: mockFn2,
        },
        {
          errorHandlerEventName: errorHandlerEventName2,
          name: 'test_1',
          exec() {
            throw new Error('Oops...');
          },
        },
      ],
    });

    // make error and skip the error
    await $act.exec('test_1').catch(() => void 0);

    expect(mockFn1).toBeCalledTimes(0);
    expect(mockFn2).toBeCalledTimes(1);
  });
});
