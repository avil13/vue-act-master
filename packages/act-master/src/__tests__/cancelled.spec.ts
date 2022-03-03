import { beforeEach, describe, expect, it } from 'vitest';
import { CancelledAct } from '../cancelled';
import { ActTest } from '../test-utils';
import { emitAction } from '../types';
import { addTestActionFactory } from './test-helpers';

const $act = ActTest.getInstance();

const addTestAction = addTestActionFactory($act);

describe('CancelledAct', () => {
  beforeEach(() => {
    ActTest.resetAll();
  });

  // tests
  it('cancel action', async () => {
    const { eventName } = addTestAction({
      exec() {
        return new CancelledAct();
      },
    });

    const cancelledResult = await $act.exec(eventName).catch((res) => res);

    expect(cancelledResult instanceof CancelledAct).toBe(true);
  });

  it('cancel action after second emit', async () => {
    // first action
    const { eventName: name1 } = addTestAction({
      exec() {
        return new CancelledAct();
      },
    });

    // second action
    const { eventName } = addTestAction({
      exec() {
        return (this.emit as emitAction)(name1, null);
      },
      emit: () => void 0,
      useEmit(emit) {
        this.emit = emit;
      },
    });

    const cancelledResult = await $act.exec(eventName).catch((res) => res);

    expect(cancelledResult instanceof CancelledAct).toBe(true);
  });
});
