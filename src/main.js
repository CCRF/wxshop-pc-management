import { createApp } from 'vue'
import App from './App.vue'
import {router} from "@/router";
import api from "@/http/index.js";
import store from "@/store/index.js";
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';

import locale from 'element-plus/lib/locale/lang/zh-cn'

createApp(App).use(router).use(api).use(store).use(ElementPlus).mount('#app');