export class Action {
  name = 'get.data';

  exec(): any {
    return {
      name: 'Leo',
    };
  }

  //@ts-ignore
  transform(data) {
    return data;
  }
}
