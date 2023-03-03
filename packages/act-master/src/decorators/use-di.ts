import { ActMasterActionDevDI } from '../types';

export function UseDI(diName: string) {
  return function (target: ActMasterActionDevDI, propertyKey: string) {
    if (!target._DI_MAP_) {
      target._DI_MAP_ = {};
    }

    target._DI_MAP_[propertyKey] = diName;
  };
}
