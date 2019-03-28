import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import AsyncComputed from 'vue-async-computed';

Vue.use(AsyncComputed);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
