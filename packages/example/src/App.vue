<template>
  <div>
    <nav class="navbar">
      <div class="container">
        <!--  -->
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <span class="has-text-primary">Vue-Act-Master</span>
            <span class="has-text-grey-light">&nbsp; - example</span>
          </a>
        </div>
        <!--  -->
        <div class="navbar-end">
          <div v-if="isAuth" class="navbar-item">
              <a @click="logout" href="#" class="is-light"> Logout </a>
          </div>
        </div>
        <!--  -->
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { DI } from './acts/di-names';
import { eventNames } from './acts/event-names';
import { Api } from './api/api';

export default defineComponent({
  data() {
    return {
      isAuth: false,
      unsubscribe: () => {},
    };
  },

  methods: {
    async checkAuth(next?: () => void) {
      const isAuth = await this.$act.exec(eventNames.checkAuth);

      if (isAuth && next) {
        next();
      }
    },

    logout() {
      this.$act.exec(eventNames.logout);
    },
  },

  // HOOKS

  created() {
    // DI
    this.$act.setDI(DI.router, this.$router);
    this.$act.setDI(DI.api, new Api());

    // Watching authorization checks.
    this.unsubscribe = this.$act.subscribe(
      eventNames.checkAuth, // event name
      (val: boolean) => {
        // handler
        this.isAuth = val;
      }
    );

    this.checkAuth();
  },

  beforeUnmount() {
    // To avoid memory leaks
    this.unsubscribe();
  },

  // check auth
  beforeRouteUpdate(_to, _from, next) {
    this.checkAuth(next);
  },
});
</script>
