<template>
  <a href="#" class="row-item">
    <div>
      <span>{{ icon }}</span> <span class="row-name">{{ item.title }}</span>
    </div>
    <span class="time">{{ time }}</span
    ><span class="time__ms"> :{{ ms }}</span>
  </a>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef } from 'vue';

import { IListItemContext } from '../types';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IListItemContext>,
      required: true,
      // default: () => ({
      //   type: ExchangeType.Request,
      //   time: Date.now(),
      //   method: 'fetchData',
      //   data: { txt: 'Hello world!!' },
      // }),
    },
  },

  computed: {
    icon(): string {
      return '<>';
    },
    time(): string {
      const d = new Date(this.item.time);
      return `${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`;
    },
    ms(): string {
      const d = new Date(this.item.time);
      return `${d.getUTCMilliseconds()}`;
    },
  },
});
</script>

<style scoped>
.row-item {
  font-size: 0.7rem;
}
.row-name {
  font-weight: bold;
}
.time,
.time__ms {
  font-size: 0.5rem;
}
.time__ms {
  opacity: 0.3;
}
</style>
