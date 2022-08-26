import Vue from 'vue';
import ElementUI from 'element-ui';

import App from './App.vue';
import router from './router';
import i18n from './i18n';
import { plugin } from '@wakeadmin/components';
import './locales';

import '@wakeadmin/components/style/index.scss';

Vue.config.productionTip = false;
Vue.use(plugin);
Vue.use(ElementUI);

new Vue({
  i18n: i18n.i18n,
  router,
  render: h => h(App),
}).$mount('#app');
