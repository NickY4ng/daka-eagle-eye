import { createApp } from 'vue';
import './index.css';
import App from './App.vue';
import { router } from './router';
import ElementPlus from 'element-plus';
import locale from 'element-plus/dist/locale/zh-cn.mjs';
import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/src/dark/css-vars.scss';
import {store} from './store';

const app = createApp(App);
app.use(ElementPlus, {locale});
app.use(store);
app.use(router);
app.mount('#app');
