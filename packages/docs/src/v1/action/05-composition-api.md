# VanillaJS, React, or Composition API

If using classes and their instances does not suit you in your project, you can use helpers.

## From Zero-to-Hero

```bash
# installation
yarn install act-master
```

```ts
import { act } from 'act-master';
// Actions
import { actions } from '../you/actions/path';

// Init
act.init({
  actions
});
```

```ts
// The following handlers will be for example
const handler = (...args) => console.log(...args);
```

The installation is finished.
Now we can program.

## Getting an Instance

```ts
import { act } from 'act-master';

// This call returns an ActMaster instance in which all methods are available.
const $act = act();
$act.exec('get.data');
$act.on('get.data', handler);
```

The imported "act" also contains the basic functions.
So you can call methods from functions, or references to them.
Fewer words, the code will be clearer.

## exec

```ts
import { act, exec } from 'act-master';

act().exec('get.data');
// OR
act.exec('get.data');
// OR
exec('get.data');
```

## subscribe, actSubscribe, on

```ts
// All functions are just aliases
import { act, actSubscribe, subscribe } from 'act-master';

subscribe('get.data', handler);
// OR
actSubscribe('get.data', handler);

act.subscribe('get.data', handler);
// OR
act.on('get.data', handler);
```

You can also pass either the entity that will be used to unsubscribe or a function as the third parameter.
An example of a function to unsubscribe.

For simplicity, all examples will be made in the Vue 3 `script setup`

### unsubscribe

```html
<script setup>
import { subscribe } from 'act-master';
import { onUnmounted } from 'vue';

subscribe('get.data', handler, onUnmounted);
// OR
onUnmounted(
  subscribe('get.data', handler)
);
</script>
```

### Clear subscription list

```html
<script setup>
import { subscribe, subListClear } from 'act-master';
import { onUnmounted } from 'vue';

const OFF_KEY = 'some const value'; // key for make unsubscribe

subscribe(
  'get.data', // event name
  handler, // handler
  OFF_KEY // You can use a string or object
);
// Let's make a simulation of several subscriptions
subscribe('get.data', handler, OFF_KEY);
subscribe('get.data', handler, OFF_KEY);
subscribe('get.data', handler, OFF_KEY);

// At the moment when you need to unsubscribe, we call the method with the unsubscribe key.
onUnmounted(() => {
  subListClear(OFF_KEY);
});
</script>
```
