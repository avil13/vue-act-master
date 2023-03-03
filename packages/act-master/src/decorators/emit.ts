import { ActMasterActionDevDI } from '../types';

export function Emit() {
  return (target: ActMasterActionDevDI, propertyKey: string) => {
    Object.defineProperty(target, 'useEmit', {
      value: function (emitter: any) {
        this[propertyKey] = emitter;
      },
    });
  };
}
