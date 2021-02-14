## Instalation

Start by creating a project.

Then add a vue-act-master.

```bash
yarn add vue-act-master
```

```ts
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

```json
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

It is also possible to transfer other options.
You can use the `ActMasterOptions` type.

```ts
import { VueActMaster, ActMasterOptions } from 'vue-act-master';
//...
```


## Constructor properties (ActMasterOptions)

| Property                              | Default   | Description
| ------------------------------------- | --------- | ------------------------------------------------- |
| actions?: ActMasterAction[];          | []        | An array of action items
| di?: DIMap;                           | {}        | DI entities
| errorOnReplaceAction?: boolean;       | true      | Error on action change
| errorOnReplaceDI?: boolean;           | false     | Error on entity DI replacement
| errorOnEmptyAction?: boolean;         | true      | Error on empty action.
| errorHandlerEventName?: ActEventName; | undefined | Action call on error (can be used in actions too)




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
