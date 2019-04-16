/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

import weatherModule from './modules/weatherModule';
import scoreboardModule from './modules/scoreboardModule';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    weather: weatherModule,
    scoreboard: scoreboardModule,
  },
});
