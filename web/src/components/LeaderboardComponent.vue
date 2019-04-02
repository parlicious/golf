<template>
  <div class="post">
    <div class="hello">
      <h1> LeaderBoard </h1>
    </div>
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="leaderboard" class="content">
      <h2>{{leaderboard.players}}</h2>
    </div>
  </div>
</template>

<script>
import { sha256 } from '../common/security';
import { ApiService } from '../common/api';

export default {
  name: 'HelloWorld',
  asyncComputed: {
    async msg() {
      return sha256('hello world');
    },
  },
  data() {
    return {
      loading: false,
      picks: null,
      leaderboard: null,
    };
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
  },
  methods: {
    async fetchData() {
      this.loading = true;
      // replace `getPost` with your data fetching util / API wrapper
      const tournaments = await ApiService.getTournaments();
      const active = tournaments.data.find(x => x.active);
      this.leaderboard = await ApiService.get(active.leaderboard);
      this.leaderboard = this.leaderboard.data;
      this.picks = await ApiService.get(active.picks);
      this.picks = this.picks.data;
      this.loading = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
