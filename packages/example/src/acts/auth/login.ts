import { ActMasterAction, CancelledAct, UseDI } from 'vue-act-master';
import { Router } from 'vue-router';

import { Api } from '../../api/api';
import { routeNames } from '../../router';
import { DI } from '../di-names';
import { eventNames } from '../event-names';

export class Login implements ActMasterAction {
  name = eventNames.login;

  @UseDI(DI.router)
  router!: Router;

  @UseDI(DI.api)
  api!: Api;

  async exec(login: string, password: string): Promise<boolean | CancelledAct> {
    const isLoggedIn = await this.api.login(login, password);

    if (!isLoggedIn) {
      return new CancelledAct(
        'Wrong login or password',
        'Try "test@test.com" and "123"'
      );
    }

    // Redirect to main page
    this.router.push({ name: routeNames.main });

    return isLoggedIn;
  }
}
