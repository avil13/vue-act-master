import { Saga } from '../../src/saga/saga';
import {
  listOfSagas,
  sagasNames,
  listOfParallelSagas,
  sagasParallelNames,
  getListOfSaga,
} from './list-of-saga.mock';

describe('Saga class', () => {
  let saga: Saga;
  const MockEventName = 'EventName';

  beforeEach(() => {
    saga = new Saga();

    saga.addSaga(MockEventName, {
      saga: {},
      exec() {
        return null;
      },
    });
  });

  it('addSaga', () => {
    expect(saga['sagaQueue']).toEqual([{ name: MockEventName }]);

    expect(() => {
      saga.addSaga(MockEventName, {
        saga: {},
        exec() {
          return null;
        },
      });
    }).toThrow();
  });

  it('removeSaga', () => {
    expect(saga['sagaQueue']).toEqual([{ name: MockEventName }]);

    saga.removeSaga(MockEventName);

    expect(saga['sagaQueue']).toEqual([]);
  });

  it('isPartOfSaga', () => {
    expect(saga.isPartOfSaga(MockEventName)).toBe(true);
  });

  it('makeQueue', () => {
    listOfSagas.forEach(s => saga.addSaga(s.name, s));
    expect(saga.makeQueue(sagasNames[0])).toEqual(sagasNames);
  });

  it('makeQueue parrallel', () => {
    listOfSagas.forEach(s => saga.addSaga(s.name, s));
    listOfParallelSagas.forEach(s => saga.addSaga(s.name, s));
    expect(saga.makeQueue(sagasNames[0])).toEqual([
      ...sagasNames,
      ...sagasParallelNames,
    ]);
  });

  it('execSaga', async () => {
    listOfSagas.forEach(s => saga.addSaga(s.name, s));
    let lastCalledEventName = '';

    await saga.execSaga(sagasNames[0], eventName => {
      lastCalledEventName = eventName;
    });

    expect(sagasNames[3]).toBe(lastCalledEventName);
  });

  it('execSaga parallel', async () => {
    listOfSagas.forEach(s => saga.addSaga(s.name, s));
    listOfParallelSagas.forEach(s => saga.addSaga(s.name, s));

    let isEventCalled = false;
    let isParallelEventCalled = false;

    await saga.execSaga(sagasNames[0], eventName => {
      if (sagasNames[3] === eventName) {
        isEventCalled = true;
      }
      if (sagasParallelNames[1] === eventName) {
        isParallelEventCalled = true;
      }
    });

    expect(isEventCalled).toBe(true);
    expect(isParallelEventCalled).toBe(true);
  });

  it.skip('execSaga and reject', async () => {
    const listOfSagas = getListOfSaga();
    let lastCalledEventName = '';

    // no reject
    // prepare
    listOfSagas.forEach(s => saga.addSaga(s.name, s));
    // test
    await saga.execSaga(sagasNames[0], eventName => {
      lastCalledEventName = eventName;
    });
    expect(sagasNames[3]).toBe(lastCalledEventName);

    // with reject
    // prepare
    const removeEventSaga = listOfSagas[2];
    removeEventSaga.saga.rejectEvents = [listOfSagas[1].name];
    saga.removeSaga(removeEventSaga.name);
    saga.addSaga(removeEventSaga.name, removeEventSaga);
    // test
  });
});
