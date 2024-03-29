import { ActMaster } from '../../act-master';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from 'vue';
import { ActSubscribe } from '../decorators';
import { VueActMaster } from '../index';

const $act = new ActMaster();

describe.skip('vue-act-master Subscribe decorator', () => {
  let DATA = Math.random();
  let app;
  beforeAll(() => {
    app = createApp({});
    app.use(VueActMaster);
  });

  beforeEach(() => {
    if ($act) {
      $act.clearActions();
      $act.clearListeners();
      $act.clearDI();
    }
    DATA = Math.random();
  });

  it('simple', async () => {
    const ACTION_NAME = 'simple';

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
    }

    const comp = new TestClass();

    await $act.exec(ACTION_NAME, DATA);

    expect(comp.orderData).toBe(DATA);
  });

  it('get prop string', async () => {
    const ACTION_NAME = 'get prop string';

    $act.addActions([
      {
        name: ACTION_NAME,
        exec(data) {
          return data;
        },
      },
    ]);

    class TestClass {
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
    const ACTION_NAME = 'get prop Function';

    $act.addActions([
      {
        name: ACTION_NAME,
        exec(data) {
          return data;
        },
      },
    ]);

    class TestClass {
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

  it('wrap method', async () => {
    const ACTION_NAME = 'wrap method';

    $act.addActions([
      {
        name: ACTION_NAME,
        exec(data) {
          return data;
        },
      },
    ]);

    class TestClass {
      @ActSubscribe(ACTION_NAME, 'value')
      onChange(data: any) {
        this.orderData = data.item;
      }

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

  it('default value', async () => {
    const ACTION_NAME = 'default value';

    $act.addActions([
      {
        name: ACTION_NAME,
        exec(data) {
          return data;
        },
      },
    ]);

    class TestClass {
      @ActSubscribe(ACTION_NAME, null, 101)
      orderData = null;
    }

    const comp = new TestClass();

    await $act.exec(ACTION_NAME);

    expect(comp.orderData).toBe(101);
  });
});
