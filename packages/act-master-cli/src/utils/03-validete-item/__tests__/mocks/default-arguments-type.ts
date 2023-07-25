/* eslint-disable @typescript-eslint/no-unused-vars */
export class Action {
  name = 'get.data';

  //@ts-ignore
  async exec(name = 'Leo'): Promise<{ name: string }> {
    return {
      name,
    };
  }
}
