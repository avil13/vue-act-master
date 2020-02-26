import Vue from 'vue';
import App from './App.vue';

import VueActMaster from 'vue-act-master';

Vue.use(VueActMaster);

// tslint:disable-next-line: no-unused-expression
new Vue({
  el: '#app',
  render: h => h(App),
});
