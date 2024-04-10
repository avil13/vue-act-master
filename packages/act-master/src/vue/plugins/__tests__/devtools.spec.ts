import { expect, it } from 'vitest';
import { ActTest } from '../../..';
import { getActInspectorState } from '../devtools';

it('getActInspectorState', () => {
  const NAME_1 = 'NAME_1';
  const NAME_2 = 'NAME_2';
  const NAME_3 = 'NAME_3';
  const NAME_ERROR_HANDLER = 'NAME_ERROR_HANDLER';

  const act = ActTest.getInstance({
    errorHandlerEventName: NAME_ERROR_HANDLER,
    actions: [
      ActTest.makeActionStub({
        name: NAME_1,
        exec: (arg1, arg2) => arg1 + arg2,
        watch: [NAME_2, NAME_3],
        validateInput: () => true,
      }),
      ActTest.makeActionStub({ name: NAME_2 }),
      ActTest.makeActionStub({ name: NAME_3 }),
      ActTest.makeActionStub({ name: NAME_ERROR_HANDLER }),
    ],
  });

  act.subscribe(NAME_1, () => null);
  act.subscribe(NAME_1, () => null);

  expect(getActInspectorState(act, NAME_1)).toEqual({
    [NAME_1]: [
      {
        key: 'subscribers',
        value: 2,
      },
      {
        key: 'errorHandlerEventName',
        value: NAME_ERROR_HANDLER,
      },
      {
        key: 'watch',
        value: `NAME_2, NAME_3`,
      },
      {
        key: 'isSingleExec',
        value: `false`,
      },
      {
        key: 'validateInput',
        value: `true`,
      },
      {
        key: 'arguments',
        value: '(arg1, arg2)',
      },
    ],
  });
});
