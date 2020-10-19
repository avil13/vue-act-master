<template>
  <div class="columns is-mobile is-desktop">
    <div class="column is-one-thirds">
      <filter-input v-model="filterString" />
      <!--  -->
      <div class="list is-hoverable list__max-vh">
        <list-item
          v-for="(item, i) in listItems"
          :key="i"
          class="list-item"
          :class="{ 'is-active': i === selectedIndex }"
          :item="item"
          @click.prevent="onSelectItem(item, i)"
        />
      </div>
      <!--  -->
    </div>
    <div class="column">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates
      sapiente nisi suscipit ipsam alias accusantium aperiam culpa provident
      fugiat quidem nihil voluptatem praesentium ex inventore esse, doloribus
      fugit quae facilis.
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';

import filterInput from '../components/form/filter-input.vue';
import listItem from '../components/list-item.vue';
import { IListItemContext } from '../types';

export default defineComponent({
  components: {
    filterInput,
    listItem,
  },

  setup() {
    const res = toRefs<{
      selectedIndex: number;
      selectedItem: IListItemContext | null;
      filterString: string;
      list: IListItemContext[];
    }>(
      reactive({
        selectedIndex: -1,
        selectedItem: null,
        filterString: '',
        list: [
          {
            title: 'Hello',
            time: Date.now(),
          },
          {
            title: 'world',
            time: Date.now(),
          },
        ],
      })
    );

    const listItems = computed(() => {
      return res.list.value.filter(
        (item) =>
          !res.filterString.value || item.title.includes(res.filterString.value)
      );
    });

    return { ...res, listItems };
  },

  methods: {
    onSelectItem(item: IListItemContext, index: number) {
      this.selectedItem = item;
      this.selectedIndex = index;
    },
  },
});
</script>
