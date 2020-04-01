import { ActMasterActions } from './../../src/types/index';

export const actNames = {
  LOAD_DATA: 'LOAD_DATA',
};

export const actMasterActions: ActMasterActions = {
  [actNames.LOAD_DATA]: {
    exec() {
      console.log('=>', 1);
    },
  },
};
