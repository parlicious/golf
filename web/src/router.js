import Vue from 'vue';
import Router from 'vue-router';
import Leaderboard from './views/Leaderboard.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'leaderboard',
      component: Leaderboard,
    },
    {
      path: '/picks',
      name: 'picks',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Picks.vue'),
    },
  ],
});
