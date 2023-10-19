import { ActMasterAction, ActMasterActionDevDI } from '../types';

export function UseDI(diName: string) {
  return function (target: ActMasterAction, propertyKey: string) {
    const tg = target as ActMasterActionDevDI;

    if (!tg._DI_MAP_) {
      tg._DI_MAP_ = {};
    }

    tg._DI_MAP_[propertyKey] = diName;
  };
}
