import { ActMasterAction } from 'vue-act-master';

import { CheckAuth } from './auth/check';
import { Login } from './auth/login';
import { Logout } from './auth/logout';

export const actions: ActMasterAction[] = [
  new CheckAuth(),
  new Login(),
  new Logout(),
];
