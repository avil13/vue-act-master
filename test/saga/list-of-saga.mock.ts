import { BaseSaga } from './../../src/types/saga.d';

export const sagasNames = ['saga_1.1', 'saga_1.2', 'saga_1.3', 'saga_1.4'];
export const sagasParallelNames = ['saga_2.1', 'saga_2.2'];

export const listOfSagas: BaseSaga[] = [
  {
    name: sagasNames[0],
    saga: {},
    exec: () => null,
  },
  {
    name: sagasNames[1],
    saga: {
      afterEvents: [sagasNames[0]],
    },
    exec: () => null,
  },
  {
    name: sagasNames[2],
    saga: {
      afterEvents: [sagasNames[1]],
    },
    exec: () => null,
  },
  {
    name: sagasNames[3],
    saga: {
      afterEvents: [sagasNames[2]],
    },
    exec: () => null,
  },
];

export const listOfParallelSagas: BaseSaga[] = [
  {
    name: sagasParallelNames[0],
    saga: {
      afterEvents: [sagasNames[0]],
    },
    exec: () => null,
  },

  {
    name: sagasParallelNames[1],
    saga: {
      afterEvents: [sagasParallelNames[0]],
    },
    exec: () => null,
  },
];
