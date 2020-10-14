
export class CancelledAct {
  constructor(readonly reason?: string, readonly data?: any) {
    if (!(this instanceof CancelledAct)) {
      return new CancelledAct(reason, data);
    }
  }
}
