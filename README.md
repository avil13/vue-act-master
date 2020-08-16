# vue-act-master

Plugin for organizing events in Vue app;

Based on pattern Commander and Observer;

---
- [Installation](#install)
- [Usage](#use)
- [Actions examples](#actions-examples)
  - [Simple](#simple)
  - [With transformation](#with-transformation)
  - [Class Styled Action](#class-styled-action)
  - [DI in Actions](#di-in-actions)
  - [Emit another Action in Action](#emit-another-action-in-action)
  - [Add Actions to Vue-act-master](#add-actions-to-vue-act-master)
- [Nuxt.JS](#nuxt-js)

---

## Install:

```bash
yarn add vue-act-master
```

```js
// main.ts

import Vue from 'vue'
import App from './App.vue'

import { VueActMaster } from 'vue-act-master';

// Actions
import { actions } from '../you/actions/path';

Vue.use(VueActMaster, {
  actions
});

new Vue({
  el: '#app',
  render: h => h(App)
})

```

```js
// tsconfig.json
{
  "compilerOptions": {
    ...

    "types": [
      // Add the types in typescript
      "vue-act-master",
    ],
  }
}
```

---

## Use

```html
<template>
  <div>
    {{ value }} - {{ result }}

    <button @click="action"> Run ACTION!!!</button>
  </div>
</template>

<script>
export default {
  data() {
    value: null,
    result: null,
  },

  methods: {
    async action() {
      // run action
      this.value = await this.$act.exec('get.data');
    }
  },

  mounted() {
    this.$act.subscribe(
      'get.data',
      (data) => {
        this.result = data;
      },
      this // for auto unsubscribe
    );
  },
}
</script>
```

---

## Actions examples

### Simple
```ts
// simplest-action.ts

import { ActMasterAction } from 'vue-act-master';

export const dataAction: ActMasterAction = {
  name: 'get.data',

  async exec() {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';

    const data = await fetch(url)
      .then(response => response.json())

    return data;
  }
};
```

### With transformation
```ts
// transformed-action.ts

import { ActMasterAction } from 'vue-act-master';

export const transformedAction: ActMasterAction = {
  name: 'get.data.transformed',

  async exec() {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';

    const data = await fetch(url)
      .then(response => response.json())

    // Output
    // {
    //  userId: 1,
    //  id: 1,
    //  title: "delectus aut autem",
    //  completed: false
    // }

    return data;
  }

  transform(data) {
    // Modifies the data after receiving
    return {
      todoItem: data.title,
      done: data.completed,
    };
  }
};
```

### Class Styled Action
```ts
// class-action.ts

import { ActMasterAction } from 'vue-act-master';

export class ClassAction implements ActMasterAction = {
  name = 'get.data';

  async exec() {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';

    const data = await fetch(url)
      .then(response => response.json())

    return data;
  }
};
```

## DI in Actions

```html
// App.vue

<script>
import { SuperAPI } from '../you/api';

{
  mounted() {
    // Adding DI scope
    this.$act.setDI('api', SuperAPI);
  }
}
</script>
```


```ts
// with-di-action.ts
// with decorator
import { ActMasterAction } from 'vue-act-master';
import { UseDI } from 'vue-act-master/decorators';


import { SuperAPI } from '../you/api';

export class WithDiAction implements ActMasterAction = {
  name = 'login';

  @UseDI('api')
  private api!: SuperAPI; // SuperAPI as interface

  exec(loginData) {
    return this.api.login(loginData);
  }
};
``
```
OR
```ts
// with-di-action.ts
// without decorator
import { ActMasterAction } from 'vue-act-master';
import { SuperAPI } from '../you/api';

export class WithDiAction implements ActMasterAction = {
  name = 'login';

  private api: SuperAPI; // SuperAPI as interface

  exec(loginData) {
    return this.api.login(loginData);
  }

  useDI({ api }) {
    this.api = api;
  }
};
```

## Emit another Action in Action

```ts
// with-emit-action.ts

import { ActMasterAction, emitAction } from 'vue-act-master';

export class WithEmitAction implements ActMasterAction = {
  name = 'login';

  private emit: emitAction;

  exec(loginData) {
    const result = this.api.login(loginData);

    // use another action
    this.emit('set.authorized', true)
  }

  useEmit(emit: emitAction) {
    this.emit = emit;
  }
};
```


## Add Actions to Vue-act-master

```html
// App.vue

<script>
// actions: ActMasterAction[]
import { actions } from '../you/actions/path';

export default {
  mounted() {
    this.$act.addActions(actions);
    // OR
    this.$act.addAction(actions[0]);
  }
}
</script>
```

---

# Nuxt.JS

Install dependencies:

```bash
yarn add vue-act-master
```

Add `vue-act-master/nuxt` to modules section of `nuxt.config.js`

```js
{
    modules: ['vue-act-master/nuxt'];
}
```