export interface VueActMasterOptions {
  errorOnReplaceAction?: boolean;
  actions?: ActMasterAction[];
}

export type TransformerFn = (value: any) => any | Promise<any>;

export type ActEventName = string;

export type listenerFunction = (arg: any) => any;

export type emitAction = (name: ActEventName, data: any | any[]) => void;

export interface ActMasterAction {
  exec(...args: any[]): Promise<any> | any;
  name: string;
  transform?: TransformerFn;
  useDI?: (contexts: { [key: string]: any }) => void;
  useEmit?: (emit: emitAction) => void;
  debounceOfEmit?: number;
  [key: string]: any;
}
