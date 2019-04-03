<template>
  <div class="post">
    <div class="hello">
      <h1> LeaderBoard </h1>
    </div>
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="!loading" class="content">
        <div v-for="participant in poolParticipants">
          {{ participant.name}} : {{participant.score}}
        </div>
    </div>
  </div>
</template>

<script>
import { sha256 } from '../common/security';
import { ScoreboardService } from '../common/scoreboard';

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
      players: {},
      poolParticipants: [],
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
      const data = await ScoreboardService.load();
      this.players = data.players;
      this.poolParticipants = data.poolParticipants;
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
