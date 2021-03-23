export class Action {
  name = 'get.data';

  exec(): any {
    return {
      name: 'Leo',
    };
  }

  transform(data: any): string {
    return data.name;
  }
}
