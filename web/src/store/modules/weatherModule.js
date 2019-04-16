/* eslint-disable no-param-reassign */

import { WeatherService } from '../../common/weather';
import { WEATHER_REFRESH_INTERVAL } from '../../common/config';

export default {
  state: {
    weather: null,
    weatherInterval: 0,
  },
  mutations: {
    setWeather(state, payload) {
      state.weather = payload.weather;
    },
    setWeatherInterval(state, payload) {
      state.weatherInterval = payload.id;
    },
  },
  getters: {
    getWeather(state) {
      return state.weather;
    },
  },
  actions: {
    async getWeather({ commit }) {
      commit({
        type: 'setWeather',
        weather: await WeatherService.getWeather(),
      });
    },
    async initWeather({ dispatch, commit, state }) {
      if (!state.weatherInterval) {
        dispatch('getWeather');
        commit({
          type: 'setWeatherInterval',
          id: setInterval(() => dispatch('getWeather'), WEATHER_REFRESH_INTERVAL),
        });
      }
    },
  },
};
