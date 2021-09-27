# For users who have already started working with "Act-Master"

## subsList

In the process, you often have to remember the subscriptions you need to unsubscribe from in order to avoid memory leaks.

In order not to store unnecessary variables for unsubscribes, you can use the `subList` property.

#### Example:

```ts
export default {
  data() {
    return {
      isLoading: false,
    }
  },

  mounted() {
    const unsubscribe1 = this.$act.subscribe('GetDta', (data) => {
      // ...
    });

    const unsubscribe2 = this.$act.inProgress('GetDta', (isLoading) => {
      this.isLoading = isLoading;
    });

    // store subscriptions
    this.$act.subsList.add('CACHE_KEY', unsubscribe1, unsubscribe2);
  },

  beforeDestroy() {
    // clear subscriptions
    this.$act.subsList.clear('CACHE_KEY');
  }
}
```

A key can be any object that can be stored in Map.

That's why it's convenient when using Vue components. You can use the current component instead of the key.

```ts
export default {
  mounted() {
    const unsubscribe = this.$act.subscribe('GetDta', (data) => {
      // ...
    });

    // store subscriptions
    this.$act.subsList.add(this, unsubscribe);
  },

  beforeDestroy() {
    // clear subscriptions
    this.$act.subsList.clear(this);
  }
}
```
<br>
<br>

#### But you can make it even easier!!!

If you use `subsList.add` - just after `subscribe` by passing only the key, the unsubscribe function will be added automatically.

```ts
export default {
  mounted() {
    this.$act.subscribe('GetDta', (data) => { });
    this.$act.subsList.add(this); // right after you subscribe

    this.$act.inProgress('GetDta', (isLoading) => {
      this.isLoading = isLoading;
    });
    this.$act.subsList.add(this);  // right after you subscribe
  },

  beforeDestroy() {
    // clear subscriptions
    this.$act.subsList.clear(this);
  }
}
```

::: warning
call `$act.subsList.add` - must be called immediately after subscribing, because only the last unsubscribe function is stored
:::

