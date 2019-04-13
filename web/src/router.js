import Vue from 'vue';
import Router from 'vue-router';
import Leaderboard from './views/Leaderboard.vue';
import Home from './views/Home.vue';
import PlayerLeaderboard from './views/PlayerLeaderboard.vue';

Vue.use(Router);

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home,
    // },
    {
      path: '/standings',
      name: 'standings',
      component: Leaderboard,
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: PlayerLeaderboard,
    },
    {
      path: '/picks',
      name: 'picks',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Picks.vue'),
    },
    { path: '*', redirect: '/standings' },
  ],
  mode: 'history',
});
