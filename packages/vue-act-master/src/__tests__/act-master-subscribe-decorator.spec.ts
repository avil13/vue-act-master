import { Component } from 'vue-property-decorator';

import { ActMaster } from 'act-master';
import Vue from 'vue';

import { ActSubscribe } from '../decorators';
import { VueActMaster } from '../index';

const $act = new ActMaster();

describe('vue-act-master Subscribe decorator', () => {
  const ACTION_NAME = 'ACTION_NAME';
  let DATA = Math.random();

  beforeEach(() => {
    if ($act) {
      $act.clearActions();
      $act.clearListeners();
      $act.clearDI();
    }
    DATA = Math.random();
  });

  it('simple', async () => {
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

  it('get prop string', async () => {
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
      @ActSubscribe(ACTION_NAME, 'value.item')
      orderData = null;
    }

    const comp = new TestClass();

    await $act.exec(ACTION_NAME, {
      value: {
        item: DATA,
      },
    });

    expect(comp.orderData).toBe(DATA);
  });

  it('get prop Function', async () => {
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
      @ActSubscribe(ACTION_NAME, ({ value }) => value.item)
      orderData = null;
    }

    const comp = new TestClass();

    await $act.exec(ACTION_NAME, {
      value: {
        item: DATA,
      },
    });

    expect(comp.orderData).toBe(DATA);
  });

  it.only('default value', async () => {
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
      @ActSubscribe(ACTION_NAME, null, 101)
      orderData = null;
    }

    const comp = new TestClass();

    await $act.exec(ACTION_NAME);

    expect(comp.orderData).toBe(101);
  });
});
