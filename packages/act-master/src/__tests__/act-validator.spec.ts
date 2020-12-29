import { ActTest } from '../test-utils';
import { addTestActionFactory } from './test-helpers';

const $act = ActTest.getInstance();

const addTestAction = addTestActionFactory($act);

describe('Act validator', () => {
  beforeEach(() => {
    ActTest.resetAll();
  });

  it('validate input args', async () => {
    const { eventName, execMock } = addTestAction({
      validateInput(arg1?: any): true | string {
        if (typeof arg1 !== 'number') {
          return 'Need number';
        }
        return true;
      },
    });

    // not valid
    await $act.exec(eventName);
    expect(execMock).not.toBeCalled();

    // valid
    await $act.exec(eventName, 100);
    expect(execMock).toBeCalledWith(100);
  });
});
