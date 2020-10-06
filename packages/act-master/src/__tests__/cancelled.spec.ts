import { ActMaster } from '../act-master';
import { CancelledAct } from '../canselled';
import { ActMasterAction, emitAction } from '../types';
import { clearActMaster, createTestActionFactory } from './test-helpers';


const $act = new ActMaster();
const createTestAction = createTestActionFactory($act);

describe('CancelledAct', () => {
  beforeEach(() => {
    clearActMaster($act)
  });

  // tests
  it('cancel action', async () => {
    const { eventName } = createTestAction({
      exec() {
        throw new CancelledAct();
      }
    });

    const cancelledResult = await $act.exec(eventName).catch(res => res);

    expect(cancelledResult instanceof CancelledAct).toBe(true);
  });

  it('cancel action after second emit', async () => {
    // first action
    const { eventName: name1 } = createTestAction({
      exec() {
        throw new CancelledAct();
      }
    });

    // second action
    const { eventName } = createTestAction({
      exec() {
        return (this.emit as emitAction)(name1, null);
      },
      emit: () => void 0,
      useEmit(emit) {
        this.emit = emit;
      }
    });

    const cancelledResult = await $act.exec(eventName).catch(res => res);

    expect(cancelledResult instanceof CancelledAct).toBe(true);
  });
});
