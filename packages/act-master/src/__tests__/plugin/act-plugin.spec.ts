import {
  ActEventName,
  ActMasterAction,
  ActMaterPluginAddMethodContext,
  ActMaterPluginContext,
  ActMaterPluginEvent,
  ActTest,
  ListenerFunction,
} from 'act-master';

const actions: ActMasterAction[] = [
  {
    validateInput() {
      return true;
    },
    name: 'getSum',
    exec(a: number, b: number) {
      return a + b;
    },
    transform(res) {
      return res;
    },
  },
  {
    watch: ['getSum'],
    name: 'watchSumIncrement',
    exec(a: number) {
      return a + 1;
    },
  },
];

it('Extending the methods of the act-master class', async () => {
  const cache = new Map<ActEventName, any>();

  function cacheMethod(ctx: ActMaterPluginAddMethodContext) {
    return {
      subscribe(eventName: ActEventName, listenerFunction: ListenerFunction) {
        if (cache.has(eventName)) {
          listenerFunction(cache.get(eventName));
        }

        const off = ctx.subscribe(eventName, (data) => {
          cache.set(eventName, data);

          listenerFunction(data);
        });
        return off;
      },
    };
  }

  const $act = ActTest.getInstance({
    actions,
    plugins: [
      (ctx: ActMaterPluginContext) => {
        ctx.addMethod('cache', cacheMethod);
      },
    ],
  });

  let result = 0;

  // Here we ignore the type, but in the doc, we add an example of an extension
  //@ts-ignore
  $act.cache.subscribe('getSum', () => null);
  await $act.exec('getSum', 2, 3); // Caching the result via subscribe
  expect(result).toBe(0);

  //@ts-ignore
  $act.cache.subscribe('getSum', (res: number) => (result = res));

  expect(result).toBe(5);
});

it('Subscribe to plugin events', async () => {
  const result: [ActMaterPluginEvent, any[] | any][] = [];

  const $act = ActTest.getInstance({
    actions,
    plugins: [
      (ctx: ActMaterPluginContext) => {
        ctx.on('beforeExec', (data) => {
          result.push(['beforeExec', data]);
        });
        ctx.on('error', (data) => {
          result.push(['error', data]);
        });
        ctx.on('validate', (data) => {
          result.push(['validate', data]);
        });
        ctx.on('execWatcher', (data) => {
          result.push(['execWatcher', data]);
        });
        ctx.on('transform', (data) => {
          result.push(['transform', data]);
        });
        ctx.on('execResult', (data) => {
          result.push(['execResult', data]);
        });
        ctx.on('subscribe', (data) => {
          result.push(['subscribe', data]);
        });
        ctx.on('unsubscribe', (data) => {
          result.push(['unsubscribe', data]);
        });
      },
    ],
  });

  await $act.exec('getSum', 2, 3);

  const testData: [ActMaterPluginEvent, any[] | any][] = [
    ['beforeExec', [2, 3]],
    ['validate', [2, 3]],
    ['transform', 5],
    ['execWatcher', ['watchSumIncrement', 5]],
    ['beforeExec', [5]],
    ['execResult', 6],
    ['execResult', 5],
  ];

  expect(result).toEqual(testData);

  const fn = () => null;
  $act.on('watchSumIncrement', fn)();

  testData.push(['subscribe', ['watchSumIncrement', fn]]);
  testData.push(['unsubscribe', ['watchSumIncrement', fn]]);

  expect(result).toEqual(testData);
});
