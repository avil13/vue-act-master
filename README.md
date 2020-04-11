### vue-act-master

Plugin for organizing events in Vue app;

Based on pattern Commander and Observer;

---

Install:

```bash
yarn add vue-act-master
```

```js
// main.ts
import Vue from 'vue'
import App from './App.vue'

import { VueActMaster } from 'vue-act-master';

Vue.use(VueActMaster, {
  errorOnReplaceAction: false
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

```

```js
export default {
  data() {
    value: null,
    result: null,
    unsubscribe: null,
  },

  methods: {
    async action() {
      // run action
      this.value = await this.$act.exec('get.data');
    }
  },

  mounted() {
    this.unsubscribe = this.$act.subscribe('get.data', ({ data }) => {
      this.result = data; // transformed data
    });
  },

  beforeDestroy() {
    // don't forget to unsubscribe that there were no memory leaks
    this.unsubscribe();
  }
}
```

