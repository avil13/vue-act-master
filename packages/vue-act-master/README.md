# Vue-Act-Master

A way to separate business logic from application view.

The easiest library to create a flexible application architecture.

![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-act-master)
![npm version](https://img.shields.io/npm/v/vue-act-master)

<div align="center">
  <img  src="https://raw.githubusercontent.com/avil13/vue-act-master/master/assets/act-master-logo.svg" alt="vue-act-master">
</div>

---

## 📗 [Documentation](https://avil13.github.io/vue-act-master/)


## 🗺 [Example project structure](https://github.com/avil13/vue-act-master/blob/master/packages/example/README.md)

## 🧪 [Test writing with "ActTest"](https://github.com/avil13/vue-act-master/blob/master/packages/act-master/src/test-utils/README.md)


---

# Example

## Installation

```bash
npm install vue-act-master
```

# Usage

```ts
// main.ts
// install vue-act-master plugin
import Vue from 'vue';
import App from './App.vue';

import { VueActMaster } from 'vue-act-master';

// Actions array
import { actions } from '../you/actions/path';

Vue.use(VueActMaster, {
  actions,
});

new Vue({
  el: '#app',
  render: (h) => h(App),
});
```

```ts
// ../you/actions/path
export const actions: ActMasterAction[] = [
  new GetDataAction(),
];
```

```ts
// action-get-data.ts
import { ActMasterAction } from 'vue-act-master';

export class GetDataAction implements ActMasterAction {
  name = 'GetData';

  async exec() {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';

    const response = await fetch(url);
    return response.json();
  }
}
```
The action is now available to you in components and you can easily highlight the business logic.

This will help you test components and change the API more easily.


```html
// App.vue

<script>
export default {
  data() {
    return {
      myData: null,
    };
  },

  async mounted() {
    console.log(this.myData); // null

    this.myData = await this.$act.exec('GetData');

    console.log(this.myData);
    // {
    //   "userId": 1,
    //   "id": 1,
    //   "title": "delectus aut autem",
    //   "completed": false
    // }
  }
}
</script>
```
