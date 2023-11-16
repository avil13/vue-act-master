import { ActMasterAction } from '../types';

export const migrationHelper = (act: ActMasterAction) => {
  if (act.watch && !act.$watch) {
    act.$watch = act.watch;
  }

  if (act.isSingleExec && typeof act.$isSingleton !== 'boolean') {
    act.$isSingleton = act.isSingleExec;
  }

  if (typeof act.validateInput === 'function' && !act.$validate) {
    act.$validate = act.validateInput.bind(act);
  }

  if (act.errorHandlerEventName && !act.$onError) {
    act.$onError = act.errorHandlerEventName;
  }
};
