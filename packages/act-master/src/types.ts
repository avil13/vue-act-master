import { CancelledAct } from './cancelled';

// TODO: Acts
export type EmitAction = ActExec;

/**
 * @deprecated use ListenerFunction
 */
export type listenerFunction = (arg: any) => any;
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
   * Function executor
   */
  exec: (...args: any[]) => Promise<any> | any;
  /**
   * Name of the action
   */
  readonly name: string;
  /**
   * Transform data after exec
   */
  transform?: TransformerFn;
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

export type ActEventName = _ExecType extends (
  name: infer N,
  ...args: any
) => any
  ? N
  : never;

export interface ActGenerated {
  default: (name: string, ...args: any) => Promise<any>;
  // acts?: any
}

type _ExecType<K = 'acts'> = K extends keyof ActGenerated
  ? ActGenerated[K]
  : ActGenerated['default'];

export type ActExec = _ExecType;

// List of functions for obtaining action types via generation
type Fn = (...args: any) => any;
declare type IsFn<T> = T extends (...args: any) => any ? T : never;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type FuncFromAct<T extends { name: string; exec: Fn }> = T extends {
  readonly name: infer N;
  readonly exec: infer F;
}
  ? (name: N, ...args: Parameters<IsFn<F>>) => Awaited<ReturnType<IsFn<F>>>
  : never;

export type Acts<LS extends ActMasterAction[]> = LS extends (infer A)[]
  ? UnionToIntersection<FuncFromAct<A extends ActMasterAction ? A : never>>
  : never;

export type ActSubscribe = ActExec extends (name: infer N, ...a: any) => infer R
  ? (name: N, cb: (data: R) => any, ctx?: any) => () => boolean
  : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const expectType = <T>(expression: T) => {
//   // Do nothing, the TypeScript compiler handles this for us
// };

// type IsEqual<T1, T2> = T1 extends T2 ? (T2 extends T1 ? true : false) : false;

// type FTest = (n: 'Two', v: number) => number;

// // example
// expectType<IsEqual<FTest, typeof exec>>(true);
