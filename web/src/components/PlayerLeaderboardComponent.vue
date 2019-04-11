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
        <th class="d-none d-sm-table-cell" scope="col">Picked By</th>
      </tr>
      </thead>
      <tr
        v-for="player in players"
        v-bind:class="{increased: player.score_diff < 0, decreased: player.score_diff > 0}"
        v-bind:key="player.tournament_id">
        <td
          class="player-name-cell"
        ><a
          rel="noreferrer"
          target="_blank"
          :href="`https://www.masters.com/en_US/scores/track/hole_view/index.html?pid=${player.id}`">
          {{player.first_name}} {{player.last_name}}
        </a>
        </td>
        <td>{{zeroOr(player.to_par)}}</td>
        <td>{{zeroOr(player.today)}}</td>
        <td>{{getPenaltyColumn(player)}}</td>
        <td>{{getPickThru(player)}}</td>
        <td>{{player.position || ''}}</td>
        <td class="d-none d-sm-table-cell">{{getParticipantsForPlayer(player)}}</td>
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
      playersToPoolParticipants: {},
      refreshTime: 0,
      ...DisplayUtils, //
    };
  },
  async created() {
    await this.fetchData();
    this.interval = setInterval(() => this.fetchData(), 30000);
  },
  async beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    async fetchData() {
      const data = await ScoreboardService.load();
      this.playersToPoolParticipants = data.playersToPoolParticipants;
      this.players = data.orderedPlayers;
    },
    getParticipantsForPlayer(player) {
      if (this.playersToPoolParticipants.hasOwnProperty(player.id)) {
        return this.playersToPoolParticipants[player.id].join(', ');
      }
      return '';
    },
  },
};
</script>

<style scoped>
  .increased{
    color: red;
  }

  .player-name-cell {
    text-align: left;
  }

  .decreased{
    color: green;
  }
</style>
