import { createApp } from 'vue'
import App from './App.vue'
import {router} from "@/router";
import api from "@/http/index.js";
import store from "@/store/index.js";

createApp(App).use(router).use(api).use(store).mount('#app');