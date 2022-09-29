import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { plugin } from '@wakeadmin/components';
import Element from 'element-plus';

import '@wakeadmin/components/style/index.scss';

import App from './App.vue';
import { routes } from './router';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App).use(router).use(Element).use(plugin);

app.mount('#app');
