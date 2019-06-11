import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Vue from 'vue';
import AsyncComputed from 'vue-async-computed';
import App from './App.vue';
import router from './router';
import store from './store';
import { ApiService } from './common/api';

Vue.use(AsyncComputed);

Vue.config.productionTip = false;
ApiService.init();

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
