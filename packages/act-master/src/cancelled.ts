export class CancelledAct {
  [key: string]: any;

  static get _name() {
    return '__CancelledAct__';
  }

  get _name() {
    return CancelledAct._name;
  }

  static is(obj: CancelledAct | any): boolean {
    if (!obj || typeof obj !== 'object') {
      return false;
    }
    return obj._name === CancelledAct._name;
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

  valueOf() {
    return null;
  }

  toString(): string {
    return this.reason;
  }
}
