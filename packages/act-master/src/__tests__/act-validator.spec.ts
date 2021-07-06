import { ActTest } from '../test-utils';
import { addTestActionFactory } from './test-helpers';

const $act = ActTest.getInstance();

const addTestAction = addTestActionFactory($act);

describe('Act validator', () => {
  afterEach(() => {
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

  it('catch exception if invalid', async () => {
    // A
    const errMock = jest.fn();
    const execMock = jest.fn();

    const $act = ActTest.getInstance({
      errorHandlerEventName: 'OnError',
      actions: [
        {
          name: 'OnError',
          exec: errMock,
        },
        {
          name: 'SomeName',
          validateInput() {
            // always invalid value
            return 'Error message';
          },
          exec: execMock,
        },
      ],
    });

    // AA
    await $act.exec('SomeName');

    // AAA
    expect(execMock).not.toBeCalled();
    expect(errMock).lastCalledWith('Error message');
  });
});
