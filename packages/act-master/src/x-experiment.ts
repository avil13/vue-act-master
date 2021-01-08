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
  exec(...args: infer A): infer R;
  // transform?: (args: any[]) => infer R2
}
  ? (name: N, ...args: A) => R | Promise<R>
  : never;

// interface ActionList {
//   actions: ActMasterAction[];
// }

const actList = [
  //
  new ActZero(),
  new ActOne(),
  // new ActTwo(),
] as const;

// declare interface ActionList {
//   actions: typeof actList;
// }

// type TAction = ActionList['actions'][number];

interface ActMasterDemo extends Omit<ActMaster, 'exec'>{
  exec: ActItem<typeof actList[number]>; // | ActMaster['exec'];
}

class ActM {
  async exec(name, ...args) {
    const act = actList.find((item) => item.name === name);
    if (!act) {
      return new Error();
    }
    return act.exec(...args);
  },
};

const $act = new ActM() as ActMasterDemo;

$act.exec('get_1', '22');

// type TExec<T extends ActMasterAction> = (
//   name: T['name'],
//   ...args: Parameters<T['exec']>
// ) => Promise<ReturnType<T['exec']>>;
// const exec: TExec<ActOne> = () => Promise.resolve(100);
// exec('get.data', 1);
