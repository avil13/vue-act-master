<script lang="ts">
interface Data {
  inputText: string;
  errorText: string;
  results: any[];
  total: 0;
}

interface PluginItem {
  name: string;
  version: string;
  description: string;
  keywords: string[];
  author: string;
  date: string;
  npm: string;
  repository: string;
  homepage: string;
}

const keywordSearch = 'act-master-plugin';

export default {
  data(): Data {
    return {
      inputText: '',
      errorText: '',
      results: [],
      total: 0,
    };
  },
  computed: {
    pluginList(): PluginItem[] {
      return this.results.map((v) => {
        return {
          name: v.package.name,
          version: v.package.version,
          description: v.package.description,
          keywords: v.package.keywords,
          author: v.package.author?.name,
          date: v.package.date,
          npm: v.package.links.npm,
          repository: v.package.links.repository,
          homepage: v.package.links.homepage,
        };
      });
    },
  },
  methods: {
    reset() {
      this.errorText = '';
      this.results = [];
      this.total = 0;
    },
    async searchPlugin(isReset: boolean) {
      if (isReset) {
        this.reset();
      }

      if (this.inputText.length < 3) {
        this.errorText = 'The name is too short';
        return;
      }

      const url = `https://api.npms.io/v2/search?from=${this.results.length}&q=keywords:${keywordSearch} not:deprecated not:unstable ${this.inputText}`;

      await fetch(url)
        .then((r) => r.json())
        .then((res) => {
          this.results.push(...res.results);
          this.total = res.total;
          if (this.total === 0) {
            this.errorText = "Couldn't find any plugins";
          }
        })
        .catch((err) => {
          this.errorText = err.message;
        });
    },
  },
};
</script>

<template>
  <div>
    <!-- <link
      href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
      rel="stylesheet"
    /> -->

    <form
      @submit.prevent="searchPlugin(true)"
      class="flex items-center justify-center px-2 py-8"
    >
      <div class="flex border-2 rounded">
        <input
          v-model="inputText"
          @input="total = 0"
          type="text"
          class="px-4 py-2 w-80"
          placeholder="Search plugin..."
          autofocus
          autocomplete="off"
        />
        <button class="flex items-center justify-center px-4 border-l">
          <svg
            class="w-6 h-6 text-gray-600"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
            />
          </svg>
        </button>
      </div>
    </form>

    <div class="block mt-2 mb-24" style="min-height: 12rem">
      <div
        v-if="errorText"
        class="px-6 py-5 mb-3 mb-4 text-base text-red-700 bg-red-100 rounded-lg"
        role="alert"
      >
        {{ errorText }}
      </div>

      <div class="flex justify-center">
        <p
          v-if="inputText && total"
          class="mb-8 text-lg text-text-center text-text-gray-300"
        >
          Found {{ total }} searching for `{{ inputText }}`
        </p>
      </div>

      <div>
        <div class="flex justify-center">
          <ul class="max-w-3xl text-gray-900 bg-white rounded-lg">
            <li
              v-for="plugin in pluginList"
              :key="plugin.name"
              class="w-full px-6 py-4 border-b border-gray-200"
            >
              <span
                class="float-right px-1 text-sm text-white bg-green-500 rounded"
                >v{{ plugin.version }}</span
              >

              <a
                :href="plugin.npm"
                target="_blank"
                rel="noopener noreferrer"
                class="block mb-4 text-xl text-green-600 focus:underline"
                >{{ plugin.name }}</a
              >

              <p class="text-gray-500">
                {{ plugin.description }}
              </p>

              <div class="flex justify-between mt-4">
                <p v-if="plugin.author" class="text-gray-600">
                  {{ plugin.author }}
                </p>

                <div class="flex flex-row-reverse">
                  <a
                    :href="plugin.npm"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ml-2 text-green-600 focus:underline"
                  >
                    npm
                  </a>
                  <a
                    v-if="plugin.repository"
                    :href="plugin.repository"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ml-2 text-green-600 focus:underline"
                  >
                    repository
                  </a>
                </div>
              </div>
              <div class="text-xs text-gray-400">
                {{ (plugin.keywords || []).join(', ') }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <button
      @click="searchPlugin(false)"
      v-if="total > results.length && !errorText"
      class="w-full p-4 border border-green-600 rounded hover:text-white hover:bg-green-500 focus:text-white focus:bg-green-500"
    >
      Load more
    </button>
  </div>
</template>

<style scoped>
*,
::before,
::after {
  box-sizing: border-box;
}
p,
ul {
  margin: 1rem 0;
  line-height: 1.7;
}
a,
button,
input {
  touch-action: manipulation;
}
a {
  text-decoration: none;
  color: var(--c-brand);
}
a:hover {
  text-decoration: underline;
}
ul {
  padding-left: 1.25em;
}
form {
  margin: 0;
}
/*! CSS Used from: https://unpkg.com/tailwindcss@%5E2/dist/tailwind.min.css */
*,
::after,
::before {
  box-sizing: border-box;
}
button,
input {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
}
button {
  text-transform: none;
}
button {
  -webkit-appearance: button;
}
::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
:-moz-focusring {
  outline: 1px dotted ButtonText;
}
p {
  margin: 0;
}
button {
  background-color: transparent;
  background-image: none;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
*,
::after,
::before {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor;
}
input::placeholder {
  opacity: 1;
  color: #9ca3af;
}
button {
  cursor: pointer;
}
:-moz-focusring {
  outline: auto;
}
a {
  color: inherit;
  text-decoration: inherit;
}
button,
input {
  padding: 0;
  line-height: inherit;
  color: inherit;
}
svg {
  display: block;
  vertical-align: middle;
}
*,
::after,
::before {
  --tw-border-opacity: 1;
  border-color: rgba(229, 231, 235, var(--tw-border-opacity));
}
.float-right {
  float: right;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-4 {
  margin-top: 1rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mb-24 {
  margin-bottom: 6rem;
}
.ml-2 {
  margin-left: 0.5rem;
}
.block {
  display: block;
}
.flex {
  display: flex;
}
.h-6 {
  height: 1.5rem;
}
.w-6 {
  width: 1.5rem;
}
.w-80 {
  width: 20rem;
}
.w-full {
  width: 100%;
}
.max-w-3xl {
  max-width: 48rem;
}
.flex-row-reverse {
  flex-direction: row-reverse;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.rounded {
  border-radius: 0.25rem;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.border-2 {
  border-width: 2px;
}
.border-b {
  border-bottom-width: 1px;
}
.border-l {
  border-left-width: 1px;
}
.border-gray-200 {
  --tw-border-opacity: 1;
  border-color: rgba(229, 231, 235, var(--tw-border-opacity));
}
.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
}
.bg-green-500 {
  --tw-bg-opacity: 1;
  background-color: rgba(16, 185, 129, var(--tw-bg-opacity));
}
.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.text-white {
  --tw-text-opacity: 1;
  color: rgba(255, 255, 255, var(--tw-text-opacity));
}
.text-gray-400 {
  --tw-text-opacity: 1;
  color: rgba(156, 163, 175, var(--tw-text-opacity));
}
.text-gray-500 {
  --tw-text-opacity: 1;
  color: rgba(107, 114, 128, var(--tw-text-opacity));
}
.text-gray-600 {
  --tw-text-opacity: 1;
  color: rgba(75, 85, 99, var(--tw-text-opacity));
}
.text-gray-900 {
  --tw-text-opacity: 1;
  color: rgba(17, 24, 39, var(--tw-text-opacity));
}
.text-green-600 {
  --tw-text-opacity: 1;
  color: rgba(5, 150, 105, var(--tw-text-opacity));
}
.focus\:underline:focus {
  text-decoration: underline;
}
*,
::after,
::before {
  --tw-shadow: 0 0 #0000;
}
*,
::after,
::before {
  --tw-ring-inset: var(--tw-empty);
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgba(5, 150, 105, 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
}
</style>
