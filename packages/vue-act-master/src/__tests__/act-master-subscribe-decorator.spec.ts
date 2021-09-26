import { Component } from 'vue-property-decorator';

import { ActMaster } from 'act-master';
import Vue from 'vue';

import { ActSubscribe } from '../decorators';
import { VueActMaster } from '../index';

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

  it('ActSubscribe', async () => {
    const DATA = Math.random();

    Vue.use(VueActMaster);

    $act.addActions([
      {
        name: ACTION_NAME,
        exec(data) {
          return data;
        },
      },
    ]);

    @Component
    class TestClass extends Vue {
      @ActSubscribe(ACTION_NAME)
      orderData = null;
    }

    const comp = new TestClass();

    await $act.exec(ACTION_NAME, DATA);

    expect(comp.orderData).toBe(DATA);
  });
});
