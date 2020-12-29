# vue-act-master

## Why?

The easiest library to create a flexible application architecture.
A way to separate business logic from application view.

---

## [Example project structure](https://github.com/avil13/vue-act-master/blob/master/packages/example/README.md) 🗺

---

## [Test writing with "ActTest"](https://github.com/avil13/vue-act-master/blob/master/packages/act-master/src/test-utils/README.md)

---

## Contents

- [Installation](#install)
- [Usage](#use)
- [Actions examples](#actions-examples)
  - [Add Actions to Vue-act-master](#add-actions-to-vue-act-master)
  - [Subscribe / Unsubscribe (on/off), once](#subscribe--unsubscribe-onoff-once)
  - [Simple](#simple)
  - [With transformation](#with-transformation)
  - [Cancel Action](#cancel-action)
  - [Class Styled Action](#class-styled-action)
  - [Wait](#wait)
  - [DI in Actions](#di-in-actions)
  - [Emit another Action in Action](#emit-another-action-in-action)
  - [Vue2 class component subscribe decorator](#vue2-class-component-subscribe-decorator)
- [Nuxt.JS](#nuxt-js)

---

## Install:

```bash
yarn add vue-act-master
```

```js
// main.ts

import Vue from 'vue';
import App from './App.vue';

import { VueActMaster } from 'vue-act-master';

// Actions
import { actions } from '../you/actions/path';

Vue.use(VueActMaster, {
  actions,
});

new Vue({
  el: '#app',
  render: (h) => h(App),
});
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
    },
  };
</script>
```

[top](#contents)

---

## Use

### Subscribe / Unsubscribe (on/off), once

```html
<template>
  <div>
    {{ value }} - {{ result }}

    <button @click="action">Run ACTION!!!</button>
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
        this // for auto unsubscribe (not working in Vue 3, send hook "onUnmounted")
      );
    },
  }
</script>
```

`Subscribe` method - returns the function to `unsubscribe` from events.

If you pass the instance `Vue` to the **third argument**, the unsubscription will be done automatically at hooks `beforeDestroy`.

For `subscribe` / `unsubscribe` methods there are also `on` / `off` aliases.

```ts
const handler = (data) => console.log(data);

const unsubscribe = this.$act.subscribe('get.data', handler);
// Same thing.
const off = this.$act.on('get.data', handler);
```

---

If you need to subscribe to only one event, use the `once` method.

Unsubscribe will be called automatically after the first triggering.

```ts
// ...
this.$act.once('get.data', handler);
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

    const data = await fetch(url).then((response) => response.json());

    return data;
  },
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
  },
};
```

[top](#contents)

---

### Validate arguments

Before calling the `exec` method, you can validate the arguments that are sent to it.

We add a method `validateInput` to which all arguments intended for `exec` get.

If they are valid we return `true`.

Otherwise an error message of your choice.

```ts
// validate-action.ts

import { ActMasterAction, CancelledAct } from 'vue-act-master';

export const dataAction: ActMasterAction = {
  name: 'get.data',

  validateInput(arg?: any): true | CancelledAct {
    if (typeof arg !== 'number') {
      return new CancelledAct('Need a number');
    }
    return true;
  }

  async exec(id: number) {
    const url = `https://jsonplaceholder.typicode.com/todos/${id}`;

    return await fetch(url).then((response) => response.json());
  },
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

    const data = await fetch(url).then((response) => response.json());

    return data;
  }
}
```

[top](#contents)

---

### Wait

You can launch the action after another one through the "wait" property.

Any of the actions in `wait`, after execution, will call the current action.

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
  // Names of events, after any and which action automatically starts.
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
}
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
}
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
    this.emit('set.authorized', true);
  }

  // set Emitter
  useEmit(emit: emitAction) {
    this.emit = emit;
  }
}
```

[top](#contents)

---

## Vue2 class component subscribe decorator

If you use vue2 and classes, you can use the decorator to subscribe.

```html
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { ActSubscribe } from 'vue-act-master';

  @Component({})
  export default class MyVueComponent extends Vue {
    @ActSubscribe('GetUserData')
    user: User | null = null;

    mounted() {
      // Making a request.
      // The data in the `user` variable will be updated automatically.
      this.$act.exec('GetUserData');
    }
  }
</script>
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

[top](#contents)

---

## Constructor properties

| Property                              | Default   | Description                                       |
| ------------------------------------- | --------- | ------------------------------------------------- |
| actions?: ActMasterAction[];          | []        | An array of action items                          |
| di?: DIMap;                           | {}        | DI entities                                       |
| errorOnReplaceAction?: boolean;       | true      | Error on action change                            |
| errorOnReplaceDI?: boolean;           | false     | Error on entity DI replacement                    |
| errorOnEmptyAction?: boolean;         | true      | Error on empty action.                            |
| errorHandlerEventName?: ActEventName; | undefined | Action call on error (can be used in actions too) |
