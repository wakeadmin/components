import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@wakeadmin/h',
  },
});
