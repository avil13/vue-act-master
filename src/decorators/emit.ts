import { ActMasterActionDevDI } from '../types';

const isNotProd = process.env.NODE_ENV !== 'production';

export function Emit() {
  return (target: ActMasterActionDevDI, propertyKey: string) => {
    //
    if (!target._EMITTER_) {
      Object.defineProperty(target, '_EMITTER_', {
        value: null,
        enumerable: isNotProd,
        writable: true,
      });
    }

    Object.defineProperty(target, propertyKey, {
      get() {
        if (!this._EMITTER_) {
          throw new Error('decorator @Emit was failed.');
        }
        return this._EMITTER_;
      },
      enumerable: isNotProd,
    });
  };
}
