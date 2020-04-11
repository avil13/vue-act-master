import { ISagaQueue, BaseSaga, execSagaCallback } from '../types/saga';
import { ActMasterAction } from '../types';

/**
 * TODO:
 *  - выстраивание дерева саг
 *  - запуск выполнения саг и сохранение цепочки их состояний
 */
export class Saga {
  private sagaQueue: ISagaQueue[] = [];

  addSaga(eventName: string, sagaItem: BaseSaga | ActMasterAction) {
    if (!sagaItem.saga) {
      return;
    }

    if (this.sagaQueue.some(item => item.name === eventName)) {
      throw new Error(`"${eventName}" already exists in saga queue.`);
    }

    const newSaga: ISagaQueue = {
      name: eventName,
    };

    if (sagaItem.saga.afterEvents) {
      newSaga.afterEvents = sagaItem.saga.afterEvents;
    }

    if (sagaItem.saga.rejectEvents) {
      newSaga.rejectEvents = sagaItem.saga.rejectEvents;
    }

    this.sagaQueue.push(newSaga);
  }

  removeSaga(eventName: string) {
    const index = this.sagaQueue.findIndex(item => item.name === eventName);
    this.sagaQueue.splice(index, 1);
  }

  isPartOfSaga(eventName: string): boolean {
    const list = this.sagaQueue;

    if (list.some(v => v.name === eventName)) {
      return true;
    }

    if (list.some(v => v.afterEvents && v.afterEvents.includes(eventName))) {
      return true;
    }

    return false;
  }

  async execSaga(eventName: string, callback: execSagaCallback) {
    const processState = {
      error: null,
      isFinished: false,
    };

    const sagaState = {
      data: {},
      get error() {
        return processState.error;
      },
      get isFinished() {
        return processState.isFinished;
      },
    };

    const queues = this.makeQueue(eventName).filter(
      (name, i, arr) => arr.indexOf(name) === i
    );

    for (const eventName of queues) {
      try {
        await callback(eventName, sagaState);
      } catch (error) {
        processState.error = error;
        processState.isFinished = true;
        break;
      }
    }
    processState.isFinished = true;
  }

  makeQueue(eventName: string, queues: string[] = []): string[] {
    queues.push(eventName);

    this.sagaQueue.forEach(item => {
      if (item.afterEvents && item.afterEvents.includes(eventName)) {
        this.makeQueue(item.name, queues);
      }
    });

    return queues;
  }
}
