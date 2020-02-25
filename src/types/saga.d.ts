import { ActMasterAction } from '.';

export type SagaState = { [key: string]: any };

export interface BaseSaga extends ActMasterAction {
  saga: ISagaParams;
  exec: (sagaState: SagaState, ...args: any[]) => any;
  undo?: () => void;
}

export interface ISagaParams {
  afterEvent?: string[];
  rejectEvent?: string[];
}

export interface ISagaQueue extends ISagaParams {
  name: string;
}
