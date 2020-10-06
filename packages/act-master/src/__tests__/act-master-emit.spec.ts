import { emitAction } from '../types';
import { ActMaster } from '../act-master';
import { Emit } from '../decorators';
import { ActMasterAction } from '../types';
import { clearActMaster } from './test-helpers';

const $act = new ActMaster();

describe('EMIT', () => {
  const ACTION_NAME_1 = 'ACTION_NAME_DEFAULT';
  const ACTION_NAME_2 = 'ACTION_NAME_CHILD';

  beforeEach(() => {
    clearActMaster($act)
  });

  it('js emitter', async () => {
    const DATA = Math.random();
    const mockCallback = jest.fn();

    class TestActionClass implements ActMasterAction {
      name = ACTION_NAME_1;
      emit!: emitAction;
      useEmit(emit: emitAction) {
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
    const mockCallback = jest.fn();

    class TestActionClass implements ActMasterAction {
      name = ACTION_NAME_1;
      @Emit()
      emit!: emitAction;
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
