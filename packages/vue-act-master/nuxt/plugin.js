import Vue from 'vue';
import { VueActMaster } from 'vue-act-master';

import { actions } from '<%= options.actions %>';

<% if (options.di) { %>
import { di } from '<%= options.di %>';
<% } else { %>
const di = {};
<% } %>

const diItems = di;


const params = {
  ...<%= JSON.stringify(options, null, 2) %>,
  actions: actions,
  di: diItems,
};

Vue.use(VueActMaster, params);

export default (ctx, inject) => {
  ctx.$act = Vue.act;
  inject('act', Vue.act);
}
