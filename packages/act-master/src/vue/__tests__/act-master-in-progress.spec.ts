import { ActMaster } from '../../act-master';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from 'vue';
import { ActInProgress } from '../decorators';
import { VueActMaster } from '../index';

const $act = new ActMaster();

describe.skip('vue-act-master InProgress decorator', () => {
  const ACTION_NAME = 'ACTION_NAME';

  beforeEach(() => {
    if ($act) {
      $act.clearActions();
      $act.clearListeners();
      $act.clearDI();
    }
  });

  it('ActInProgress', async () => {
    const app = createApp({});
    app.use(VueActMaster);

    $act.addActions([
      {
        name: ACTION_NAME,
        resolve: null,
        exec(isStop: boolean) {
          if (isStop && this.resolve) {
            return this.resolve();
          }
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const self = this;
          return new Promise((resolve) => {
            self.resolve = resolve;
          });
        },
      },
    ]);

    class TestClass {
      @ActInProgress(ACTION_NAME)
      isLoading = false;
    }

    const comp = new TestClass();

    $act.exec(ACTION_NAME); // start action

    expect(comp.isLoading).toBe(true);

    await $act.exec(ACTION_NAME, true); // stop action

    expect(comp.isLoading).toBe(false);
  });
});
