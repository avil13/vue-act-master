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
  __UseDI__?: (contexts: { [key: string]: any }) => void;
}
