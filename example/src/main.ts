import Vue from 'vue';
import App from './App.vue';

import act from 'vue-act-master';

console.log('=>', act);
debugger;

// import { VueActMaster, VueActMasterInstance } from 'vue-act-master';

// Vue.use(VueActMaster);

// declare module 'vue/types/vue' {
//   interface Vue {
//     $act: VueActMasterInstance;
//   }
//   interface VueConstructor<V extends Vue = Vue> {
//     act: VueActMasterInstance;
//   }
// }

// tslint:disable-next-line: no-unused-expression
new Vue({
  el: '#app',
  render: h => h(App),
});
