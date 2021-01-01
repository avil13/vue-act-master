# Add Actions to Vue-act-master

You can add actions in different ways.

Suppose you have a variable with an array of actions:

```ts
// actions: ActMasterAction[]
import { actions } from '../you/actions/path';
```

You can pass it to the constructor options:

```ts
import { VueActMaster } from 'vue-act-master';
import { actions } from '../you/actions/path';

Vue.use(VueActMaster, {
  actions,
});
```

Or add it already in the component.

```vue
// App.vue

<script>
import { actions } from '../you/actions/path';

export default {
  mounted() {
    this.$act.addActions(actions);
    // OR one action
    this.$act.addAction(actions[0]);
  },
};
</script>
```