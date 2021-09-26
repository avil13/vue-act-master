import './index.css';

import { createApp } from 'vue';
import { VueActMaster } from 'vue-act-master';

import { actions } from './acts';
import { router } from './router';
import App from './App.vue';

const app = createApp(App);

app.use(VueActMaster, {
  actions,
});
app.use(router);

app.mount('#app');
