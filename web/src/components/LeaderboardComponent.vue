<template>
  <div class="post">
    <div class="hello">
      <h1> Leaderboard </h1>
    </div>
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="leaderboardActive">
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

    <div v-if="!leaderboardActive">
      <p> The leaderboard will be available when the tournament begins</p>
    </div>
  </div>
</template>

<script>
import { ScoreboardService } from '../common/scoreboard';
import PoolParticipantComponent from '@/components/PoolParticipantComponent.vue';

export default {
  name: 'LeaderboardComponent',
  components: { 'pool-participant': PoolParticipantComponent },
  data() {
    return {
      loading: false,
      showAll: false,
      leaderboardActive: false,
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
          const participant = p;
          participant.picks = participant.picks.map(pick => this.players[pick.id]);
          return participant;
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
