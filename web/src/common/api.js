import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { API_URL, DATA_URL } from '@/common/config';

export const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = DATA_URL;
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  getTournaments() {
    // const timeSalt = Date.now();
    return this.get(`${DATA_URL}/tournaments.json?${Date.now()}`);
  },

  getGolfers() {
    return this.get(`${DATA_URL}/golfers.json`);
  },

  getIndividualPicks(email, tournament, year) {
    const params = {
      email,
      tournament,
      year,
    };

    return Vue.axios.get(API_URL, { params }).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  submitPicks(picksRequest) {
    return this.post(API_URL, picksRequest);
  },

  get(resource) {
    return Vue.axios.get(`${resource}`).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  post(resource, params) {
    return Vue.axios.post(`${resource}`, params);
  },

  update(resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  put(resource, params) {
    return Vue.axios.put(`${resource}`, params);
  },

  delete(resource) {
    return Vue.axios.delete(resource).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },
};

export default ApiService;
