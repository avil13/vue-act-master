import { Saga } from '../../src/saga/saga';

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

  it.skip('execSaga', () => null);

  it.skip('makeQueue', () => null);
});
