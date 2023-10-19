import { ActMaster, ActMasterAction, Emit, EmitAction } from '../..';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('EMIT', () => {
  const ACTION_NAME_1 = 'ACTION_NAME_DEFAULT';
  const ACTION_NAME_2 = 'ACTION_NAME_CHILD';
  let $act: ActMaster;

  beforeEach(() => {
    if ($act) {
      $act.clearActions();
      $act.clearListeners();
      $act.clearDI();
    }

    $act = new ActMaster();
  });

  it('js emitter', async () => {
    const DATA = Math.random();
    const mockCallback = vi.fn();

    class TestActionClass implements ActMasterAction {
      name = ACTION_NAME_1;
      emit!: EmitAction;
      useEmit(emit: EmitAction) {
        this.emit = emit;
      }
      async exec(data: number) {
        await this.emit(ACTION_NAME_2, data);
      }
    }

    $act.addActions([
      {
        name: ACTION_NAME_2,
        exec(data) {
          mockCallback(data);
        },
      },
      new TestActionClass(),
    ]);

    await $act.exec(ACTION_NAME_1, DATA);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(DATA);
  });

  it('decorator emitter', async () => {
    const DATA = Math.random();
    const mockCallback = vi.fn();

    class TestActionClass implements ActMasterAction {
      name = ACTION_NAME_1;
      @Emit()
      emit!: EmitAction;
      async exec(data: number) {
        await this.emit(ACTION_NAME_2, data);
      }
    }

    $act.addActions([
      {
        name: ACTION_NAME_2,
        exec(data) {
          mockCallback(data);
        },
      },
      new TestActionClass(),
    ]);

    await $act.exec(ACTION_NAME_1, DATA);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(DATA);
  });
});
