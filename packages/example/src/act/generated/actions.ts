import { ActMasterAction } from 'vue-act-master';

import { CheckAuth } from '../auth/check.act';
import { Login } from '../auth/login.act';
import { Logout } from '../auth/logout.act';

export const actions: ActMasterAction[] = [
  new CheckAuth(),
  new Login(),
  new Logout(),
];
