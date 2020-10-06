import { CancelledAct } from './canselled';

export type ActEventName = string;

export type emitAction<T = any> = (
  name: ActEventName,
  data?: any | any[]
) => Promise<T>;

export type listenerFunction = (arg: any) => any;

export type TransformerFn = (value: any) => any | Promise<CancelledAct | any>;

export interface VueActMasterOptions {
  actions?: ActMasterAction[];
  errorOnReplaceAction?: boolean;
  errorOnEmptyAction?: boolean;
}

export interface ActMasterAction {
  exec(...args: any[]): Promise<CancelledAct | any> | CancelledAct | any;
  name: string;
  transform?: TransformerFn;
  UseDI?: (contexts: { [key: string]: any }) => void;
  useEmit?: (emit: emitAction) => void;
  debounceOfEmit?: number;
  [key: string]: any;
}

export interface ActMasterActionDevDI extends ActMasterAction {
  _DI_?: {
    [DIName: string]: {
      name: string;
      value: null | any;
    };
  };
  _EMITTER_?: emitAction;
  __UseDI__?: (contexts: { [key: string]: any }) => void;
}
