import { CancelledAct } from './cancelled';

/**
 * @deprecated use ListenerFunction
 */
export type listenerFunction = (arg: any) => any;
export type ListenerFunction = (arg: any) => any;

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
  errorOnReplaceDI?: boolean;
  // method for calling auto unsubscribe
  autoUnsubscribeCallback?: (args: autoUnsubscribeArgs) => void;
  errorHandlerEventName?: ActEventName;
}

export type devActMasterConfig = {
  errorOnReplaceDI: ActMasterOptions['errorOnReplaceDI'];
  autoUnsubscribeCallback: ActMasterOptions['autoUnsubscribeCallback'];
  errorHandlerEventName?: ActEventName;
};

export interface ActMasterAction {
  /**
   * Name of the action
   */
  readonly name: string;
  /**
   * Function executor
   */
  exec: (...args: any[]) => Promise<any> | any;
  /**
   * List of emitNames to be called after
   */
  watch?: ActEventName[];
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
  useDI?: (contexts: { [key: string]: any }) => void;
  /**
   * Pass Emitter to action
   */
  useEmit?: (emit: EmitAction) => void;
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

export interface ActGenerated {
  default: (name: string, ...args: any) => Promise<any>;
  // acts?: any
  defaultSubs: (
    name: string,
    cb: (data: any) => any,
    ctx?: any
  ) => () => boolean;
  // subs?: any
  // names?: string
}

type _ExecType<K = 'acts'> = K extends keyof ActGenerated
  ? ActGenerated[K]
  : ActGenerated['default'];

type _SubsType<K = 'subs'> = K extends keyof ActGenerated
  ? ActGenerated[K]
  : ActGenerated['defaultSubs'];

type _NameType<K = 'names'> = K extends keyof ActGenerated
  ? ActGenerated[K]
  : string;

// #region [ helpers ]
// List of functions for obtaining action types via generation
type Fn = (...args: any) => any;
type IsFn<T> = T extends (...args: any) => any ? T : never;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
type UnPromise<T> = T extends Promise<infer U> ? U : T;
type UnsubscribeFnType = () => boolean;
// #endregion

// #region [ for generation ]
type FuncFromAct<T extends { name: string; exec: Fn }> = T extends {
  readonly name: infer N;
  readonly exec: infer F;
}
  ? (name: N, ...args: Parameters<IsFn<F>>) => Awaited<ReturnType<IsFn<F>>>
  : never;
//
type SubsFromAct<T extends { name: string; exec: Fn }> = T extends {
  readonly name: infer N;
  readonly exec: infer F;
}
  ? (
      name: N,
      cb: (data: UnPromise<ReturnType<IsFn<F>>>) => any,
      ctx?: any
    ) => UnsubscribeFnType
  : never;
//
type NamesFromAct<T extends { name: string; exec: Fn }> = T extends {
  readonly name: infer N;
  readonly exec: Fn;
}
  ? N
  : never;
// For generator
/**
 * @example
 * declare module 'act-master' {
 *    export interface ActGenerated {
 *      acts: Acts<typeof actions>;
 *      subs: Subs<typeof actions>;
 *      names: Names<typeof actions>;
 *    }
 *  }
 */
export type Acts<LS extends ActMasterAction[]> = LS extends (infer A)[]
  ? UnionToIntersection<FuncFromAct<A extends ActMasterAction ? A : never>>
  : never;
//
export type Subs<LS extends ActMasterAction[]> = LS extends (infer A)[]
  ? UnionToIntersection<SubsFromAct<A extends ActMasterAction ? A : never>>
  : never;
//
export type Names<LS extends ActMasterAction[]> = LS extends (infer A)[]
  ? NamesFromAct<A extends ActMasterAction ? A : never>
  : never;
// #endregion

// Execs
export type ActExec = _ExecType;
// Subscriptions

export type ActSubscribeType = _SubsType;
// Names
export type ActEventName = _NameType;
//
export type EmitAction = ActExec;
