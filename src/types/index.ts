export interface VueActMasterOptions {
  errorOnReplaceAction?: boolean;
  actions?: ActMasterActions | ActMasterActionNamed[];
}

export type TransformerFn = (value: any) => any | Promise<any>;

export type ActEventName = string;

export type listenerFunction = (arg: any) => any;

export type emitAction = (data: any | any[]) => void;

export abstract class ActMasterAction {
  abstract exec(...args: any[]): Promise<any> | any;
  transform?: TransformerFn;
  useVue?: (vue: Vue) => void;
  useStates?: (states: { [key: string]: any }) => void;
  useEmit?: (emit: emitAction) => void;
  emit?: (value: any | any[]) => void;
  [key: string]: any;
}

export interface ActMasterActionNamed extends ActMasterAction {
  name: string;
}

export interface ActMasterActions {
  [eventName: string]: ActMasterAction;
}
