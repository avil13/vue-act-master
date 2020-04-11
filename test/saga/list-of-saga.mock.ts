import { BaseSaga } from '../../src/types/saga';

export const sagasNames = ['saga_1.1', 'saga_1.2', 'saga_1.3', 'saga_1.4'];
export const sagasParallelNames = ['saga_2.1', 'saga_2.2'];

const sagasList: BaseSaga[] = [
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

const parallelSagas: BaseSaga[] = [
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

function dup(o) {
  // "string", number, boolean
  if (typeof o !== 'object') {
    return o;
  }

  // null
  if (!o) {
    return o; // null
  }

  const r = o instanceof Array ? [] : {};
  for (const i in o) {
    if (o.hasOwnProperty(i)) {
      r[i] = dup(o[i]);
    }
  }
  return r;
}

export const getSimpleSagas = (): BaseSaga[] => dup(sagasList);

export const geParallelSagas = (): BaseSaga[] => dup(parallelSagas);
