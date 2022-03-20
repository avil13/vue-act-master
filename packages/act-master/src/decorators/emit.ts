import { ActMasterActionDevDI } from '../types';

export function Emit() {
  return (target: ActMasterActionDevDI, propertyKey: string) => {
    target.useEmit = (emitter) => {
      target[propertyKey] = emitter;
    };
  };
}
