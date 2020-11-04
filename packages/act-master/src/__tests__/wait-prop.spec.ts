import { CancelledAct } from '../cancelled';
import { ActTest } from '../test-utils';
import { addTestActionFactory } from './test-helpers';

const $act = ActTest.getInstance();

const addTestAction = addTestActionFactory($act);

describe('wait-prop', () => {
  beforeEach(() => {
    ActTest.resetAll();
  });

  // tests
  it('wait called after emit', async () => {
    const name1 = 'name1';
    const name2 = 'name2';

    const { expectMockResult } = addTestAction({
      name: name1,
    });

    const { execMock } = addTestAction({
      name: name2,
      wait: [name1],
    });

    await $act.exec(name1);

    expect(execMock).toBeCalledWith(expectMockResult);
  });

  it('wait NOT called after CANCELLED', async () => {
    const name1 = 'name1';
    const name2 = 'name2';

    addTestAction({
      name: name1,
      exec() {
        return new CancelledAct('Please stop!!!');
      },
    });

    const { execMock } = addTestAction({
      name: name2,
      wait: [name1],
    });

    await $act.exec(name1);

    expect(execMock).not.toBeCalled();
  });

  xit('waitOnce', async () => {
    //
  });

  xit('clear waiters', async () => {
    //
  });
});
