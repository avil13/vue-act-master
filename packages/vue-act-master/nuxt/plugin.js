import Vue from 'vue';
import { VueActMaster } from 'vue-act-master';

Vue.use(VueActMaster, <%= JSON.stringify(options, null, 2) %>);
