import { ActMasterAction, ActMasterActionDevDI } from '../types';

export function Emit() {
  return (target: ActMasterAction, propertyKey: string) => {
    Object.defineProperty(target as ActMasterActionDevDI, 'useEmit', {
      value: function (emitter: any) {
        this[propertyKey] = emitter;
      },
    });
  };
}
