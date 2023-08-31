import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import wakeadminComponent from 'unplugin-wakeadmin-components/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    wakeadminComponent({
      debug: true,
    }),
    vue(),
  ],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@wakeadmin/h',
  },
});
