import { CancelledAct } from '../cancelled';

export type ActEventName = string;

export type emitAction<T = any> = (
  name: ActEventName,
  ...data: any[]
) => Promise<T>;

export type ListenerFunction = (arg: any) => any;

export type TransformerFn = (value: any) => any | Promise<CancelledAct | any>;

export type ValidateInputFn = (
  ...args: any[]
) => true | CancelledAct | any | Promise<true | CancelledAct | any>;

export type autoUnsubscribeArgs = {
  eventName: string;
  listener: ListenerFunction;
  context?: any;
};

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
  errorHandlerEventName?: ActEventName;
  plugins?: ActMaterPlugin[];
}

export type devActMasterConfig = {
  errorOnReplaceAction: ActMasterOptions['errorOnReplaceAction'];
  errorOnReplaceDI: ActMasterOptions['errorOnReplaceDI'];
  errorOnEmptyAction: ActMasterOptions['errorOnEmptyAction'];
  autoUnsubscribeCallback: ActMasterOptions['autoUnsubscribeCallback'];
  errorHandlerEventName?: ActEventName;
};

export interface ActMasterAction {
  /**
   * Function executor
   */
  exec(...args: any[]): Promise<CancelledAct | any> | CancelledAct | any;
  /**
   * Name of the action
   */
  readonly name: ActEventName;
  /**
   * Transform data after exec
   */
  transform?: TransformerFn;
  /**
   * List of emitNames to be called after
   */
  watch?: string[];
  /**
   * Use watch
   * @deprecated
   */
  wait?: string[];
  /**
   * An action can have only one result if several calls are made
   */
  isSingleExec?: boolean;
  /**
   * Validating arguments before passing them to exec
   */
  validateInput?: ValidateInputFn;
  /**
   * Pass Dependency to action
   */
  UseDI?: (contexts: { [key: string]: any }) => void;
  /**
   * Pass Emitter to action
   */
  useEmit?: (emit: emitAction) => void;
  /**
   * Name of the action that catches the error
   */
  errorHandlerEventName?: ActEventName;
  [key: string]: any;
}

export interface ActMasterActionDevDI extends ActMasterAction {
  _DI_?: {
    [DIName: string]: {
      name: string;
      value: null | any;
    };
  };
}

/// #region [ plugins ]
export type ActMaterPlugin = (ctx: ActMaterPluginContext) => void;

export interface ActMaterPluginContext {
  addMethod(
    methodName: string,
    plugin: (ctx: ActMaterPluginAddMethodContext) => any
  ): void;
  on(ev: ActMaterPluginEvent, callback: (data?: any) => void): void;
}

export type ActMaterPluginEvent =
  | 'beforeExec'
  | 'error'
  | 'validate'
  | 'execWatcher'
  | 'transform'
  | 'execResult'
  | 'subscribe'
  | 'unsubscribe';

export interface ActMaterPluginAddMethodContext {
  subscribe(
    eventName: ActEventName,
    listener: ListenerFunction,
    context?: any
  ): () => boolean;
  on(
    eventName: ActEventName,
    listener: ListenerFunction,
    context?: any
  ): () => boolean;

  unsubscribe(eventName: ActEventName, listener: ListenerFunction): boolean;
  off(eventName: ActEventName, listener: ListenerFunction): boolean;
}
// #endregion
