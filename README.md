### vue-act-master

Plugin for organizing events in Vue app;

Based on pattern Commander and Observer;

```js
export default {
  data() {
    value: null,
    result: null,
    unsubscribe: null,
  },

  methods: {
    async action() {
      this.value = await this.$act.exec('get.data');
    }
  },

  mounted() {
    this.unsubscribe = this.$act.subscribe('get.data', ({ data }) => {
      this.result = data; // transformed data
    });
  },

  beforeDestroy() {
    this.unsubscribe();
  }
}
```