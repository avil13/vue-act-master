import { ActMaster } from 'act-master';
import { ActSubscribe } from '../decorators';

const $act = new ActMaster();

describe('vue-act-master Subscribe decorator', () => {
  const ACTION_NAME = 'ACTION_NAME';

  beforeEach(() => {
    if ($act) {
      $act.clearActions();
      $act.clearListeners();
      $act.clearDI();
    }
  });

  xit('DI same entity', async () => {
    const DATA = Math.random();

    $act.addActions([
      {
        name: ACTION_NAME,
        exec(data) {
          return data;
        },
      },
    ]);

    class TestClass {
      @ActSubscribe(ACTION_NAME)
      orderData = null;

      mixins = [];
    }

    const comp = new TestClass();

    await $act.exec(ACTION_NAME, DATA);

    expect(comp.mixins).toBe(DATA);
    // expect(comp.orderData).toBe(DATA);
  });
});
