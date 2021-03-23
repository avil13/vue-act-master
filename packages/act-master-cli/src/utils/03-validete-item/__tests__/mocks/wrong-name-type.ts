export class Action {
  name = 101;

  async exec(): Promise<{ name: string }> {
    return {
      name: 'Leo',
    };
  }
}
