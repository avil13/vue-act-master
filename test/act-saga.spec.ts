import Vue from 'vue';
import { VueActMasterInstance } from '../src/vue-act-master-instance';
import { BaseSaga } from '../src/types/saga';

describe('Saga Base tests', () => {
  let $act: VueActMasterInstance;
  let execMethodMock: jest.Mock;
  let expectRandomValue: string;

  beforeEach(() => {
    expectRandomValue = Math.random().toString();
    execMethodMock = jest.fn();
    execMethodMock.mockReturnValue(expectRandomValue);

    $act = new VueActMasterInstance({} as Vue, {});
  });

  it.skip('Последовательное выполнени саг', () => {
    const mySaga1: BaseSaga = {
      saga: {},
      exec(sagaState) {
        sagaState.value = 100;
      },
    };

    const mySaga2: BaseSaga = {
      saga: {
        afterEvent: ['get.data'],
      },
      exec(sagaState) {
        sagaState.value = 2 * sagaState.value;
      },
    };
    const mySaga3: BaseSaga = {
      saga: {
        afterEvent: ['get.data', 'set.data'],
      },
      exec(sagaState) {
        return sagaState.value;
      },
    };

    $act.addActions({
      'get.data': mySaga1,
      'set.data': mySaga2,
      'check.data': mySaga3,
    });

    expect($act.exec('get.data')).toBe(200);
  });

  it.skip('Паралельное выполнение саг', () => ({}));
  it.skip('Отмена изменений при ошибке в цепочке саг', () => ({}));
});
