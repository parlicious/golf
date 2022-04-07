import Vue from 'vue';
import Router from 'vue-router';
import Leaderboard from './views/Leaderboard.vue';
import History from './views/History.vue';
import Standings from './views/Standings.vue';
import Stream from './views/Stream.vue';
import Rosters from "./views/Rosters.vue";
import Ticker from "./views/Ticker.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/history',
      name: 'history',
      component: History,
    },
    {
      path: '/standings',
      name: 'standings',
      component: Standings,
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: Leaderboard,
    },
    {
      path: '/stream',
      name: 'stream',
      component: Stream,
    },
    {
      path: '/rosters',
      name: 'rosters',
      component: Rosters,
    },
    {
      path: '/ticker',
      name: 'ticker',
      component: Ticker,
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
