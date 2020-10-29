import { ActMaster, ActMasterOptions } from 'act-master';
import { inherits } from 'util';
import { clearActMaster, entityCount, removeSingleton } from './test-helpers';

let $act: ActMaster = new ActMaster();

const init = (options: ActMasterOptions = {}) => {
  removeSingleton();

  $act = new ActMaster(options);
};

describe('ActMaster constructor options', () => {
  beforeEach(() => {
    clearActMaster($act);
  });

  const exec = () => void 0;

  it('actions', () => {
    expect(entityCount($act, 'actions')).toBe(0);

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

    expect(entityCount($act, 'actions')).toBe(2);
  });

  it('di', () => {
    expect(entityCount($act, 'di')).toBe(0);

    init({
      di: {
        api: {},
        router: {},
        store: {},
      },
    });

    expect(entityCount($act, 'di')).toBe(3);
  });

  it('errorOnReplaceAction:[true]', () => {
    const actions = [{ name: 'test-name', exec }];

    init({
      errorOnReplaceAction: true,
      actions,
    });

    const add = () => $act.addActions(actions);

    expect(add).toThrow('actiion "test-name" already existing');
  });

  it('errorOnReplaceAction:[false]', () => {
    const actions = [{ name: 'test-name', exec }];

    init({
      errorOnReplaceAction: false,
      actions,
    });

    const add = () => $act.addActions(actions);

    expect(add).not.toThrow();
  });

  it('errorOnEmptyAction:[true]', async () => {
    init({
      errorOnEmptyAction: true,
    });

    try {
      await $act.exec('test');

      expect(true).toBe(`We can't get in here.`);
    } catch (e) {
      expect(e instanceof Error).toBe(true);
    }
  });

  it('errorOnReplaceDI', () => {
    init({
      errorOnReplaceDI: true,
      di: {
        api: {},
      },
    });

    const run = () => $act.setDI('api', {});

    expect(run).toThrow();
  });

  it('autoUnsubscribeCallback', () => {
    const mockFn = jest.fn();

    init({
      autoUnsubscribeCallback: mockFn,
    });

    $act.subscribe('test', () => void 0);

    expect(mockFn).toBeCalledTimes(1);
  });
});
