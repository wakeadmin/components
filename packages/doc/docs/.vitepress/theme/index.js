import DefaultTheme from 'vitepress/theme';
import { plugin } from '@wakeadmin/components';
import ElementPlus from 'element-plus';
import { watch } from 'vue';
import 'element-plus/dist/index.css';
import '@wakeadmin/components/style/index.scss';

import './custom.css';

export default {
  ...DefaultTheme,
  enhanceApp({ router, app }) {
    app.use(ElementPlus);
    app.use(plugin);

    // register global components
    if (typeof window !== 'undefined') {
      let viewer;
      const setup = () => {
        const container = document.querySelector('.vp-doc');
        if (container != null) {
          if (viewer) {
            viewer.update();
          } else {
            viewer = new Viewer(container, { toolbar: false, navbar: false });
          }
        } else if (viewer) {
          viewer.destroy();
          viewer = undefined;
        }
      };

      watch(
        () => router.route,
        () => {
          setTimeout(() => {
            setup();
          }, 1000);
        },
        { immediate: true, deep: true }
      );
    }
  },
};
