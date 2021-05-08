import Vue from 'vue';
import { VueActMaster } from 'vue-act-master';

import actions from '<%= options.actions %>';

<% if (options.di) { %>
import di from '<%= options.di %>';
<% } else { %>
  const di = {};
<% } %>

const actionsList = actions && actions.actions || actions;
const diItems = di && di.di || di;


const params = {
  ...<%= JSON.stringify(options, null, 2) %>,
  actions: actionsList,
  di: diItems,
};

Vue.use(VueActMaster, params);

export default (ctx, inject) => {
  ctx.$act = Vue.act;
  inject('act', Vue.act);
}
