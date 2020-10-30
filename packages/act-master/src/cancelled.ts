export class CancelledAct {
  static readonly _name = 'CancelledAct';

  static is(obj: CancelledAct | any): boolean {
    return (
      obj._name === CancelledAct._name && typeof obj.reason !== 'undefined'
    );
  }

  get _name() {
    return CancelledAct._name;
  }

  constructor(public readonly reason: string = '', public readonly data?: any) {
    //
  }
}
