import Vue, { PluginObject } from 'vue';

import { ActMaster } from './act-master';
import { UseDI } from './decorators';
import { VueActMasterOptions, ActMasterAction, emitAction } from './types';

export { ActMaster, ActMasterAction, emitAction, UseDI, VueActMasterOptions };

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
