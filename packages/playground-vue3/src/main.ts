import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { plugin } from '@wakeadmin/components';
import Element from 'element-plus';
import Bay from '@wakeadmin/bay';

import App from './App.vue';
import { routes } from './router';

let app: any;

Bay.createMicroApp({
  async mount(container) {
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    });
    app = createApp(App).use(router).use(Element).use(plugin);

    app.mount(container?.querySelector('#app') ?? '#app');
  },
  async unmount() {
    app?.unmount();
  },
});
