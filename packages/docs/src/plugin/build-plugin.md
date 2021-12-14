# Build plugin for Act-Master

Sometimes it happens that you want to implement something that is missing in the basic set of libraries.

Then plugins come to help.

Here you will learn how you can write your own plugin and extend the functionality of act-master.

## Adding a plugin to act-master

In order to add a plugin, you must pass an array of plugins to the config when ActMaster starts.

```ts
import MySuperPlugin from '...';

new ActMaster({
  plugins: [ MySuperPlugin ]
});
```

That's all.

## How to write your own plugin for Act-Master

To do this, you need to do a few things.

- Write a function according to the `ActMaterPlugin` interface
- Extend the basic `ActMaster` interface if you add methods
- Pack it into an npm package with the keyword `act-master-plugin`
- Publish and share the link with colleagues)))

Below are a few examples of plugin options. [Logger](#logger) and [Caching](#caching) system.

## Event Tracking
### Logger

We will write a simple plugin that will log requests and responses.

```ts
// simple-act-logger-plugin.ts
import { ActMaterPluginContext } from 'act-master';

export function simpleActLoggerPlugin(ctx: ActMaterPluginContext) {
  ctx.on('beforeExec', (data) => {
    console.log('LOG IN:', data); // will get the data before they are processed in the action
  });
  ctx.on('execResult', (data) => {
    console.log('LOG OUT:', data); // action result
  });
}
```

::: warning
Be careful.
In the callback, a reference to the object passed to the action is passed.
If you change the object here, the action will also change it.
:::

The `ActMaterPluginContext.on` is a simple form for subscribing to events.
The names of all events can be found in the `ActMaterPluginEvent` interface.

Now by plugging in the plugin, we will see in the console the data we sent when we called the action.

```ts
import { simpleActLoggerPlugin } from '../simple-act-logger-plugin';

new ActMaster({
  plugins: [ simpleActLoggerPlugin ]
});
```

## Adding methods
### Caching

In this example, we write a method that extends the ActMaster class by adding another method to it.

The result will look like this:

```ts
$act.cache.subscribe('EventName', (data) => {
  console.log('LOG:', data);
})
```

Here we use the property `.cache` which we added with the plugin. In case we have already received a value, it will be passed directly to the callback.

Code of the plugin itself:

```ts
import { ActMaterPluginContext } from 'act-master';

export function simpleActCachePlugin(ctx: ActMaterPluginContext) {
  ctx.addMethod('cache', cacheMethodFactory); // add a method
}

const CACHE = new Map();

// A function that returns a method or property
function cacheMethodFactory(ctx: ActMaterPluginAddMethodContext) {
  return {
    subscribe(eventName: ActEventName, listenerFunction: ListenerFunction) {
      // check if there is already a cache, then immediately return it
      if (CACHE.has(eventName)) {
        listenerFunction(CACHE.get(eventName));
      }

      return ctx.subscribe(eventName, (data) => {
        CACHE.set(eventName, data);

        listenerFunction(data);
      });
    },
  };
}
```

In `cacheMethodFactory` we get `ActMaterPluginAddMethodContext` through which we can manage subscriptions.

### Adding a method to the ActMaster interface

So that TypeScript would not complain that we are using the unknown `cache` property in the example above, we need to add it to the interface.

```ts
import { ActMaster } from 'act-master';

export interface ActMaster {
  cache: {
    subscribe(eventName: ActEventName, listenerFunction: ListenerFunction): void;
  }
}
```

### Publishing

If you want to share your plugin, specify `act-master-plugin` in `package.json` in the `keywords` block.

Then your project can be found on the [plugins search page](./search).
