import { EmitAction, type ActMasterAction } from '../types';
import { DIMap } from '../types';

export abstract class BaseActMasterAction implements ActMasterAction {
  abstract name: string;

  abstract exec: (...args: any[]) => Promise<any> | any;

  $emit!: EmitAction;

  $di!: DIMap;

  useEmit(emit: EmitAction) {
    this.$emit = emit;
  }

  useDI(di: DIMap) {
    this.$di = di;
  }
}
