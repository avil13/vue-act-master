import Vue, { PluginObject } from 'vue';

import { ActMaster } from './act-master';
import { Emit, UseDI } from './decorators';
import { ActMasterAction, emitAction, VueActMasterOptions } from './types';

export {
  ActMaster,
  ActMasterAction,
  Emit,
  emitAction,
  UseDI,
  VueActMasterOptions,
};

/**
 * Declaration
 *
 */
declare module 'vue/types/vue' {
  interface Vue {
    $act: ActMaster;
  }

  interface VueConstructor<V extends Vue = Vue> {
    act: ActMaster;
  }
}

export class VueActMaster implements PluginObject<VueActMasterOptions> {
  static install(vue: typeof Vue, options?: VueActMasterOptions): void {
    const actMaster = new ActMaster(vue, options);

    vue.act = actMaster;
    vue.prototype.$act = actMaster;
  }

  install(vue: typeof Vue, options?: VueActMasterOptions): void {
    VueActMaster.install(vue, options);
  }
}
