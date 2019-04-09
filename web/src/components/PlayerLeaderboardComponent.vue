<template>
  <div>
    <h1> Tournament Leaderboard</h1>
  <table class="table">
    <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Total</th>
      <th scope="col">Today</th>
      <th scope="col">Penalty</th>
      <th scope="col">Thru</th>
    </tr>
    </thead>
    <tr
      v-for="player in players"
      v-bind:key="player.tournament_id">
      <td>{{player.first_name}} {{player.last_name}}</td>
      <td>{{player.to_par}}</td>
      <td>{{player.today}}</td>
      <td>{{getPenaltyColumn(player)}}</td>
      <td>{{player.thru}}</td>
    </tr>
  </table>
  </div>
</template>

<script>
import { ScoreboardService } from '../common/scoreboard';

export default {
  name: 'PlayerLeaderboardComponent',
  data() {
    return {
      players: {},
    };
  },
  created(){
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const data = await ScoreboardService.load();
      this.players = data.orderedPlayers;
    },
    getPenaltyColumn(pick) {
      if (pick.individual_bonus) {
        return pick.individual_bonus;
      }
      if (pick.individual_pen) {
        return pick.individual_pen;
      }
      return 0;
    },
  },
};
</script>

<style scoped>

</style>
