
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import App from './App.vue';
import { routes } from './router';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App).use(router)

app.mount('#app');


