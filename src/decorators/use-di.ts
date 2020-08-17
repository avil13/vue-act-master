import { ActMasterActionDevDI } from './../types';

const isNotProd = process.env.NODE_ENV !== 'production';

const setValueInDI = (
  diTargetContainer: ActMasterActionDevDI['_DI_'],
  diBindName: string,
  value: any
) => {
  for (const key in diTargetContainer) {
    if (diTargetContainer[key].name === diBindName) {
      diTargetContainer[key].value = value;
    }
  }
};

export function UseDI(diName: string) {
  return (target: ActMasterActionDevDI, propertyKey: string) => {
    //
    if (!target._DI_) {
      Object.defineProperty(target, '_DI_', {
        value: {},
        enumerable: isNotProd,
      });
    }

    Object.defineProperty(target._DI_, propertyKey, {
      value: {
        name: diName,
        value: null,
      },
      writable: true,
      configurable: false,
      enumerable: isNotProd,
    });

    Object.defineProperty(target, propertyKey, {
      get() {
        return this._DI_[propertyKey].value;
      },
      enumerable: isNotProd,
    });

    //
    if ('__useDI__' in target) {
      return;
    }

    Object.defineProperty(target, '__useDI__', {
      value(diItems: { [key: string]: any }) {
        const DI = this._DI_;

        for (const k in diItems) {
          if (!DI) {
            continue;
          }
          setValueInDI(DI, k, diItems[k]);
        }
      },
      enumerable: isNotProd,
      writable: false,
      configurable: false,
    });
  };
}
