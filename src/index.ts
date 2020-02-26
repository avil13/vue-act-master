import Vue, { PluginObject } from 'vue';
import { VueActMasterOptions } from './types';
import { VueActMasterInstance } from './vue-act-master-instance';

class VueActMaster implements PluginObject<VueActMasterOptions> {
  install(vue: Vue | any, options?: VueActMasterOptions) {
    const actMasterInstance = new VueActMasterInstance(vue, options);

    vue.act = actMasterInstance;
    vue.prototype.$act = actMasterInstance;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $act: VueActMasterInstance;
  }

  interface VueConstructor<V extends Vue = Vue> {
    act: VueActMasterInstance;
  }
}

export default new VueActMaster();
