import Vue from 'vue';
import App from './App.vue';

// import { VueActMaster, VueActMasterInstance } from 'vue-act-master';
import { VueActMaster } from '../../dist'; // this string for current file

Vue.use(VueActMaster);

// tslint:disable-next-line: no-unused-expression
new Vue({
  el: '#app',
  render: h => h(App),
});
