<template>
  <div>
    <div class="tabs">
      <ul>
        <li
          v-for="(item, i) in links"
          :key="i"
          :class="{ 'is-active': $route.name === item.toName }"
        >
          <router-link :to="{ name: item.toName }">
            {{ item.title }}
          </router-link>
        </li>
      </ul>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { routes } from './router';
import { routeNames } from './router/route-names';

export default defineComponent({
  setup() {
    const links = routes.map(item => {
      return {
        title: item.meta?.title || item.name,
        toName: item.name,
      };
    })

    return {
      links: ref(links),
    };
  },
});
</script>
