import Vue, { PluginObject } from 'vue';
import {
  VueActMasterOptions,
  ActMasterAction,
  ActMasterActionNamed,
} from './types';
import { VueActMasterInstance } from './vue-act-master-instance';

/**
 * Declaration
 *
 */
declare module 'vue/types/vue' {
  interface Vue {
    $act: VueActMasterInstance;
  }

  interface VueConstructor<V extends Vue = Vue> {
    act: VueActMasterInstance;
  }
}

class VueActMaster implements PluginObject<VueActMasterOptions> {
  static install(vue: typeof Vue, options?: VueActMasterOptions): void {
    const actMasterInstance = new VueActMasterInstance(vue, options);

    vue.act = actMasterInstance;
    vue.prototype.$act = actMasterInstance;
  }

  install(vue: typeof Vue, options?: VueActMasterOptions): void {
    VueActMaster.install(vue, options);
  }
}

export {
  VueActMaster,
  VueActMasterInstance,
  VueActMasterOptions,
  ActMasterAction,
  ActMasterActionNamed,
};
