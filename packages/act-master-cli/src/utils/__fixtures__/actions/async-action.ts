/* eslint-disable @typescript-eslint/no-unused-vars */
export class AsyncAction {
  name = 'async.action';

  // @ts-ignore
  async exec(arg0: number, arg1: string): Promise<{ name: string } | null> {
    return {
      name: 'Leo',
    };
  }
}
