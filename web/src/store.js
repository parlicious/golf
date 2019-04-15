/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

import { WeatherService } from './common/weather';
import { WEATHER_REFRESH_INTERVAL } from './common/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    weather: null,
    weatherInterval: 0,
  },
  mutations: {
    setWeather(state, payload) {
      state.weather = payload.weather;
    },
    setWeatherInterval(state, payload) {
      state.weatherIntervalId = payload.id;
    },
  },
  actions: {
    async getWeather({ commit }) {
      commit({
        type: 'setWeather',
        weather: await WeatherService.getWeather(),
      });
    },
    async initWeather({ dispatch, commit }) {
      dispatch('getWeather');
      commit({
        type: 'setWeatherInterval',
        id: setInterval(() => dispatch('getWeather'), WEATHER_REFRESH_INTERVAL),
      });
    },
  },
});
