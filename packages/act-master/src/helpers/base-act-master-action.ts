import { EmitAction, type ActMasterAction } from '../types';
import { act } from './index';

export abstract class BaseActMasterAction implements ActMasterAction {
  abstract name: string;

  abstract exec(...args: any[]): Promise<any> | any;

  $emit: EmitAction = (...args) => {
    return act().exec(...args);
  };

  $di<T = any>(key: string): T {
    //@ts-ignore
    return this._DI_CONTAINER_[key];
  }
}
