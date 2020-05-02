export type TransformerFn = (value: any) => any | Promise<any>;

export type ActEventName = string;

export interface IListenerArgs {
  eventName: string;
  value: any;
  data: any;
}

export type listenerFunction = (arg: IListenerArgs) => any;

export interface ActMasterAction {
  exec(...args: any[]): Promise<any> | any;
  // history?: boolean;
  transform?: TransformerFn;
  [key: string]: any;
}

export interface ActMasterActionNamed extends ActMasterAction {
  name: string;
}

export interface ActMasterActions {
  [eventName: string]: ActMasterAction;
}

export interface VueActMasterOptions {
  errorOnReplaceAction?: boolean;
  actions?: {
    [key: string]: ActMasterAction;
  };
}
