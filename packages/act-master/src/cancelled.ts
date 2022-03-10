export class CancelledAct {
  [key: string]: any;

  static readonly _name = '__CancelledAct__';

  static is(obj: CancelledAct | any): boolean {
    return obj._name === CancelledAct._name;
  }

  get _name() {
    return CancelledAct._name;
  }

  readonly reason: string = '';
  readonly data;

  constructor(reason: any);
  constructor(reason?: string, data?: any);
  constructor(reason?: any, data?: any) {
    if (typeof reason === 'string') {
      this.reason = reason;
      this.data = data;
      return;
    }
    if (reason && typeof reason === 'object') {
      return Object.assign(reason, {
        _name: this._name,
        reason: reason.message || '',
      });
    }
  }
}
