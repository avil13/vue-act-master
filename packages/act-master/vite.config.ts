import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      name: 'act-master',
      entry: 'src/index.ts',
    },
    minify: 'terser',
    sourcemap: true,
  },
});
