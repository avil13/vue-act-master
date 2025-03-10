import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false, // REMOVE
    lib: {
      name: 'act-master',
      entry: ['src/index.ts', 'src/vue/index.ts'],
    },
    rollupOptions: {
      external: ['vue'], // Указываем, что vue — внешний модуль
    },
  },
});
