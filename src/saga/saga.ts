import { ISagaQueue, BaseSaga, SagaState } from '@/types/saga';
import { ActMasterAction } from '@/types';

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

    if (list.some(v => v.afterEvent && v.afterEvent.includes(eventName))) {
      return true;
    }

    return false;
  }

  async execSaga(
    eventName: string,
    callback: (eventName: string, sagaState: SagaState) => any
  ) {
    const sagaState = {};
    const queues: string[] = this.makeQueue(eventName).filter(
      (item, i, arr) => arr.indexOf(item) !== i
    );

    for (const event of queues) {
      await callback(event, sagaState);
    }
  }

  makeQueue(eventName: string, queues: string[] = []): string[] {
    queues.push(eventName);
    this.sagaQueue.forEach(item => {
      if (item.afterEvent && item.afterEvent.includes(eventName)) {
        queues.push(item.name);
        this.makeQueue(item.name, queues);
      }
    });

    return queues;
  }
}
