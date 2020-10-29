import { CancelledAct } from './cancelled';

export type ActEventName = string;

export type emitAction<T = any> = (
  name: ActEventName,
  data?: any | any[]
) => Promise<T>;

export type listenerFunction = (arg: any) => any;

export type TransformerFn = (value: any) => any | Promise<CancelledAct | any>;

export type autoUnsubscribeArgs = {
  eventName: string;
  listener: listenerFunction;
  context?: any;
};

export interface listenersMap {
  [eventName: string]: listenerFunction[];
}

export interface waiterMap {
  [eventName: string]: string[]; // list of emitNames to be called after
}

export interface DIMap {
  [key: string]: any;
}

export interface ActMasterOptions {
  actions?: ActMasterAction[];
  di?: DIMap;
  errorOnReplaceAction?: boolean;
  errorOnReplaceDI?: boolean;
  errorOnEmptyAction?: boolean;
  // method for calling auto unsubscribe
  autoUnsubscribeCallback?: (args: autoUnsubscribeArgs) => void;
}

export type devActMasterConfig = {
  errorOnReplaceAction: ActMasterOptions['errorOnReplaceAction'];
  errorOnReplaceDI: ActMasterOptions['errorOnReplaceDI'];
  errorOnEmptyAction: ActMasterOptions['errorOnEmptyAction'];
  autoUnsubscribeCallback: ActMasterOptions['autoUnsubscribeCallback'];
};

export interface ActMasterAction {
  exec(...args: any[]): Promise<CancelledAct | any> | CancelledAct | any;
  name: string;
  transform?: TransformerFn;
  wait?: string[]; // // list of emitNames to be called after
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
