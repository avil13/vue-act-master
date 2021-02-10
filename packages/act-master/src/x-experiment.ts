/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActMaster } from './act-master';
import { ActMasterAction } from './types';

export type listenerFunction = (arg: any) => any;

export class ActZero implements ActMasterAction {
  readonly name = 'get_0';
  exec() {
    return ['hello', 'world'];
  }
}

export class ActOne implements ActMasterAction {
  readonly name = 'get_1';
  exec(id: number) {
    return id + 1;
  }

  // transform(n: number): string {
  //   return `${n}`;
  // }
}

// export class ActTwo implements ActMasterAction {
//   readonly name = 'get_2';
//   exec(id: number, name: string) {
//     return `${id}_${name}`;
//   }
// }

type ActItem<T extends ActMasterAction> = T extends {
  readonly name: infer N;
  exec(...args: infer P): infer R;
  // transform?: (args: R) => infer R2
}
  ? (name: N, ...args: P) => Promise<R>
  : never;

type ActItemArgs<T extends ActMasterAction> = T extends {
  readonly name: infer N;
  exec(...args: infer P): any;
}
  ? [name: N, ...args: P]
  : never;

type GetAction<
  L extends { name: string }[],
  T extends string
> = T extends L[infer N]['name'] ? L[N] : never;

// interface ActionList {
//   actions: ActMasterAction[];
// }

const actList = [
  //
  new ActZero(),
  new ActOne(),
  // new ActTwo(),
  // ] as const;
];

type xxx = GetAction<typeof actList, 'get_0'>;

// declare interface ActionList {
//   actions: typeof actList;
// }

// type TAction = ActionList['actions'][number];

// interface ActMasterDemo extends Omit<ActMaster, 'exec'> {
//   exec: ActItem<typeof actList[number]>; // | ActMaster['exec'];
// }

type IActExecArgs = ActItemArgs<typeof actList[number]>;

class ActM {
  async exec(argsList: IActExecArgs) {
    const [name, ...args] = argsList;

    const act = actList.find((item) => item.name === name);

    if (!act) {
      return new Error();
    }
    return act.exec(...args);
  }
}

const $act = new ActM();

$act.exec('get_0');
$act.exec('get_1', 2);

// type TExec<T extends ActMasterAction> = (
//   name: T['name'],
//   ...args: Parameters<T['exec']>
// ) => Promise<ReturnType<T['exec']>>;
// const exec: TExec<ActOne> = () => Promise.resolve(100);
// exec('get.data', 1);

interface ActContracts {
  GetIds: (key: 'GetIds') => number[];
  GetId: (key: 'GetId') => number;
}

type ActionByContract = ActContracts[keyof ActContracts]
//  extends (
//   name: infer K
// ) => any
//   ? K
//   : 'never2';

type Act = keyof ActContracts extends never
  ? ActMaster['exec']
  : ActionByContract;

const exec: Act = (key) => {
  console.log('=>', key);
  return 1;
};

export const expectType = <T>(expression: T) => {
  // Do nothing, the TypeScript compiler handles this for us
};

expectType<(key: 'GetId') => number>(exec('GetId'));
