<template>
  <div class="post">
    <div class="hello">
      <h1> Leaderboard </h1>
    </div>
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div class="condense-expand"
      v-on:click="showAll = !showAll">
      <div v-if="showAll">
        Collapse All
      </div>
      <div v-if="!showAll">
        Expand All
      </div>
    </div>
    <div v-if="!loading" class="content">
      <table class="table">
        <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">Name</th>
          <th scope="col">Total</th>
          <th scope="col">Today</th>
          <th scope="col">Thru</th>
        </tr>
        </thead>
        <pool-participant
          v-for="participant in poolParticipants"
          v-bind:key="participant.name"
          v-bind:showPlayers="showAll"
          v-bind:participant="participant">
        </pool-participant>
      </table>
    </div>
  </div>
</template>

<script>
import { sha256 } from '../common/security';
import { ScoreboardService } from '../common/scoreboard';
import PoolParticipantComponent from '@/components/PoolParticipantComponent.vue';

export default {
  name: 'LeaderboardComponent',
  components: { 'pool-participant': PoolParticipantComponent },
  asyncComputed: {
    async msg() {
      return sha256('hello world');
    },
  },
  data() {
    return {
      loading: false,
      showAll: false,
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
      this.poolParticipants = data.poolParticipants
        .map((p) => {
          p.picks = p.picks.map(pick => this.players[pick.id]);
          return p;
        });
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

  .condense-expand{
    text-align: left;
  }
</style>
