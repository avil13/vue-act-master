import { ActMasterActionDevDI } from '../types';

export function UseDI(diName: string) {
  return (target: ActMasterActionDevDI, propertyKey: string) => {
    if (!target._DI_CONTAINER_) {
      Object.defineProperty(target, '_DI_CONTAINER_', {
        value: {},
        enumerable: false,
        writable: true,
      });
    }

    Object.defineProperty(target, propertyKey, {
      get() {
        return this._DI_CONTAINER_[diName];
      },
      enumerable: true,
    });
  };
}
