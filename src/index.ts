import Vue from 'vue';
import { VueActMasterOptions } from './types';
import { VueActMasterInstance } from './vue-act-master-instance';

export class VueActMaster {
  static install(vue: Vue | any, options: VueActMasterOptions): void {
    const actMasterInstance = new VueActMasterInstance(vue, options);

    vue.act = actMasterInstance;
    vue.prototype.$act = actMasterInstance;
  }
}
