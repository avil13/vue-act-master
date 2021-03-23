export class Action {
  name = 'get.data';

  async exec(): Promise<{ name: string }> {
    return {
      name: 'Leo',
    };
  }
}
