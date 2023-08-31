import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      name: 'vue-act-master',
      entry: 'src/index.ts',
      formats: ['es', 'cjs', 'umd'],
    },
  },
});
