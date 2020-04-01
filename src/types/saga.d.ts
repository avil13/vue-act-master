import { ActMasterAction } from '.';

export type SagaState = {
  data: { [key: string]: any };
  readonly error: Error | null;
  readonly isFinished: boolean;
};

export interface BaseSaga extends ActMasterAction {
  saga: ISagaParams;
  exec: (sagaState: SagaState, ...args: any[]) => any;
  onReject?: (sagaState: SagaState) => void;
}

export interface ISagaParams {
  afterEvents?: string[];
  rejectEvents?: string[];
}

export interface ISagaQueue extends ISagaParams {
  name: string;
}

export type execSagaCallback = (eventName: string, sagaState: SagaState) => any;
