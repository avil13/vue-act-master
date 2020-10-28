<template>
  <form @submit.prevent="submit">
    <div class="hero is-primary">
      <div class="hero-body">
        <h1 class="title has-text-centered is-size-2">Login Form</h1>
        <div class="columns is-centered">
          <div class="column is-half">
            <div class="notification is-light">

              <div v-if="message" class="notification is-danger">
                <button
                  @click.prevent="resetMessage"
                  class="delete"
                ></button>
                <strong>{{ message }}</strong
                ><br />
                {{ description }}
              </div>

              <div class="field">
                <label class="label">Name</label>
                <p class="control has-icons-left has-icons-right">
                  <input
                    v-model="login"
                    class="input"
                    type="email"
                    placeholder="Email"
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                </p>
              </div>

              <div class="field">
                <label class="label">Password:</label>
                <p class="control has-icons-left">
                  <input
                    v-model="password"
                    class="input"
                    type="password"
                    placeholder="Password"
                  />
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                </p>
              </div>

              <button
                type="submit"
                class="button is-info is-rounded is-outlined is-medium"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { CancelledAct } from 'act-master';
import { defineComponent, ref } from 'vue';
import { eventNames } from '../acts/event-names';

export default defineComponent({
  name: 'Login',

  data() {
    return {
      login: 'test@test.com',
      password: '',
      message: '',
      description: '',
    };
  },

  methods: {
    resetMessage() {
      this.message = '';
      this.description = '';
    },

    async submit() {
      const res = await this.$act.exec<boolean | CancelledAct>(
          eventNames.login,
        this.login,
        this.password
      );

      if (typeof res !== 'boolean' && res.reason) {
        this.message = `${res.reason}`;
        this.description = `${res.data}`;
      }
    },
  },
});
</script>
