/* eslint-disable @typescript-eslint/no-unused-vars */
export class NoPromiseAction {
  name = 'noPromise.action';

  // @ts-ignore
  exec(arg0: number, arg1: string): { name: string } {
    return {
      name: 'Leo',
    };
  }
}
