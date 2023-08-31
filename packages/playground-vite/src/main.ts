import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import { plugin } from '@wakeadmin/components';

import 'element-plus/dist/index.css';
import '@wakeadmin/components/style/index.scss';
import './style.css';
import App from './App.vue';

const app = createApp(App);
app.use(ElementPlus);
app.use(plugin);

app.mount('#app');
