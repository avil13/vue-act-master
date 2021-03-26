/* eslint-disable @typescript-eslint/no-unused-vars */
export class AsyncAction {
  name = 'async.action';

  // @ts-ignore
  exec(
    arg0: number,
    arg1: string
  ): Promise<{ name: string; age: number } | null> {
    return Promise.resolve({ name: arg1, age: arg0 });
  }
}
