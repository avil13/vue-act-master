import TestPersonClass, { ITestPerson } from '../test-types';

export class WithOtherTypeReturn {
  name = 'with-other-type-return';

  exec(
    arg0: number,
    arg1: string
  ): Promise<ITestPerson | TestPersonClass | { name: string; age: number }> {
    return Promise.resolve({ name: arg1, age: arg0 });
  }
}
