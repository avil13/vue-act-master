import Vue from 'vue';
import { VueActMaster } from 'vue-act-master';

Vue.use(VueActMaster, <%= JSON.stringify(options, null, 2) %>);

export default (ctx, inject) => {
  ctx.$act = Vue.act;
  inject('act', Vue.$act);
}
