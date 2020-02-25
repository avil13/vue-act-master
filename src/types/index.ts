export type TransformerFn = (value: any) => any | Promise<any>;

export type listenerFunction = (...args: any[]) => any;

export interface ActMasterAction {
  exec(...args: any[]): Promise<any> | any;
  // history?: boolean;
  transform?: TransformerFn;
  [key: string]: any;
}

export interface ActMasterActions {
  [eventName: string]: ActMasterAction;
}

export interface VueActMasterOptions {
  actions?: {
    [key: string]: ActMasterAction;
  };
}
