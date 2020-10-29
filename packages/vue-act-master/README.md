# vue-act-master

## Why?

The easiest library to create a flexible application architecture.
A way to separate business logic from application view.

---

[Example project structure](https://github.com/avil13/vue-act-master/blob/master/packages/example/README.md) 🗺

---

## Contents

- [Installation](#install)
- [Usage](#use)
- [Actions examples](#actions-examples)
  - [Add Actions to Vue-act-master](#add-actions-to-vue-act-master)
  - [Simple](#simple)
  - [With transformation](#with-transformation)
  - [Cancel Action](#cancel-action)
  - [Class Styled Action](#class-styled-action)
  - [Wait](#wait)
  - [DI in Actions](#di-in-actions)
  - [Emit another Action in Action](#emit-another-action-in-action)
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

[top](#contents)

---

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

[top](#contents)

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
      this // for auto unsubscribe (not working in Vue 3)
    );
  },
}
</script>
```

[top](#contents)

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

[top](#contents)

---

### Cancel Action

Action can be interrupted by returning a special object "CancelledAct".
This will stop the chain of events if you build it using `wait` or `emit`.

```ts
// cancel-action.ts

import { ActMasterAction, CancelledAct } from 'vue-act-master';

export const dataAction: ActMasterAction = {
  name: 'get.data',

  exec() {
    // ...
    return new CancelledAct('Some reason to stop action...');
  }
};
```

[top](#contents)

---

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
[top](#contents)

---

### Class Styled Action

```ts
// class-action.ts

import { ActMasterAction } from 'vue-act-master';

export class ClassAction implements ActMasterAction {
  name = 'get.data';

  async exec() {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';

    const data = await fetch(url)
      .then(response => response.json())

    return data;
  }
};
```

[top](#contents)

---

### Wait

You can launch the action after another one through the "wait" property.

```ts
// Action queue
import { ActMasterAction } from 'vue-act-master';

export class FirstAction implements ActMasterAction {
  name = 'FirstAction';
  exec() {
    return {
      name: 'Leo',
    };
  }
};

export class SecondAction implements ActMasterAction {
  // The name of the action, after which this action will automatically start.
  wait: ['FirstAction'],
  name = 'SecondAction';
  exec(data) {
    console.log(data); // { "Name": "Leo" }
    return {
      name: 'Mike',
    };
  }
};
```

[top](#contents)

---

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

import { UseDI, ActMasterAction } from 'vue-act-master';

import { SuperAPI } from '../you/api';

export class WithDiAction implements ActMasterAction {
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

export class WithDiAction implements ActMasterAction {
  name = 'login';

  private api: SuperAPI; // SuperAPI as interface

  exec(loginData) {
    return this.api.login(loginData);
  }

  // get DI scope
  useDI({ api }) {
    this.api = api;
  }
};
```

[top](#contents)

---

## Emit another Action in Action

```ts
// with-emit-action.ts
// with decorator

import { Emit, ActMasterAction, emitAction } from 'vue-act-master';

export class WithEmitAction implements ActMasterAction {
  name = 'login';

  @Emit();
  private emit!: emitAction;

  exec(loginData) {
    const result = api.login(loginData);

    // use another action
    this.emit('set.authorized', true)
  }
};
```

OR

```ts
// with-emit-action.ts
// without decorator

import { ActMasterAction, emitAction } from 'vue-act-master';

export class WithEmitAction implements ActMasterAction {
  name = 'login';

  private emit: emitAction;

  exec(loginData) {
    const result = api.login(loginData);

    // use another action
    this.emit('set.authorized', true)
  }

  // set Emitter
  useEmit(emit: emitAction) {
    this.emit = emit;
  }
};
```

[top](#contents)

---

## Nuxt.JS

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