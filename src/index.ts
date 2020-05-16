import Vue, { PluginObject } from 'vue';
import { VueActMasterOptions, ActMasterAction, emitAction } from './types';
import { ActMaster } from './act-master';

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

class VueActMaster implements PluginObject<VueActMasterOptions> {
  static install(vue: typeof Vue, options?: VueActMasterOptions): void {
    const actMaster = new ActMaster(vue, options);

    vue.act = actMaster;
    vue.prototype.$act = actMaster;
  }

  install(vue: typeof Vue, options?: VueActMasterOptions): void {
    VueActMaster.install(vue, options);
  }
}

export {
  VueActMaster,
  ActMaster,
  VueActMasterOptions,
  ActMasterAction,
  emitAction,
};
