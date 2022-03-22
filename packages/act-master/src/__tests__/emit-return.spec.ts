import { ActMasterAction, ActTest, Emit, EmitAction } from '..';
import { describe, expect, it, vi } from 'vitest';

describe('Emit return value', () => {
  it('emit same action', async () => {
    const $act = ActTest.getInstance();

    class Action implements ActMasterAction {
      name = 'ACT_NAME';

      @Emit()
      emit!: EmitAction;

      exec() {
        this.emit('ACT_NAME', 'one');
        return 'two';
      }
    }

    $act.addAction(new Action());

    const mockFn = vi.fn();

    $act.subscribe('ACT_NAME', mockFn);

    await $act.exec('ACT_NAME');

    expect(mockFn).toBeCalledTimes(2);
    expect(mockFn).nthCalledWith(1, 'one');
    expect(mockFn).nthCalledWith(2, 'two');
  });
});
