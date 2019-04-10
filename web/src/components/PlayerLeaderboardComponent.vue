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
      <th scope="col">Pos</th>
    </tr>
    </thead>
    <tr
      v-for="player in players"
      v-bind:key="player.tournament_id">
      <td>{{player.first_name}} {{player.last_name}}</td>
      <td>{{zeroOr(player.to_par)}}</td>
      <td>{{zeroOr(player.today)}}</td>
      <td>{{getPenaltyColumn(player)}}</td>
      <td>{{getPickThru(player)}}</td>
      <td>{{player.position || ''}}</td>
    </tr>
  </table>
  </div>
</template>

<script>
import { ScoreboardService } from '../common/scoreboard';
import { DisplayUtils } from '../common/displayUtils';

export default {
  name: 'PlayerLeaderboardComponent',
  data() {
    return {
      players: {},
      ...DisplayUtils
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
  },
};
</script>

<style scoped>

</style>
