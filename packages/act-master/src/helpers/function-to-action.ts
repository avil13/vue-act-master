import { ActMasterAction } from '../types';

export const functionToAction = (
  func: (...args: any[]) => any
): ActMasterAction => {
  if (typeof func !== 'function' || !func.name) {
    throw new Error(`Pass not valid function: "${func}"`);
  }
  return {
    name: func.name,
    exec: func,
  };
};

export const fn2act = functionToAction;
