import { ActMasterAction, UseDI } from 'vue-act-master';

import { Api } from '../../api/api';
import { DI } from '../di-names';
import { eventNames } from '../event-names';

export class Logout implements ActMasterAction {
  name = eventNames.logout;

  @UseDI(DI.api)
  api!: Api;

  exec(): Promise<void> {
    return this.api.logout();
  }
}
