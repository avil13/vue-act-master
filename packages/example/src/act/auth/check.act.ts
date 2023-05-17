import { ActMasterAction, UseDI } from 'vue-act-master';
import { Router } from 'vue-router';

import { Api } from '../../api/api';
import { routeNames } from '../../router';
import { DI } from '../di-names';
import { eventNames } from '../event-names';

export class CheckAuth implements ActMasterAction {
  name = eventNames.checkAuth;

  wait = [
    // watch events
    eventNames.login,
    eventNames.logout,
  ];

  @UseDI(DI.router)
  router!: Router;

  @UseDI(DI.api)
  api!: Api;

  async exec(): Promise<boolean> {
    const isAuth = await this.api.isAuthenticated();

    if (!isAuth) {
      if (this.router.currentRoute.value.name !== routeNames.login) {
        // Redirect to login page
        this.router.push({ name: routeNames.login });
      }
    }

    return isAuth;
  }
}
