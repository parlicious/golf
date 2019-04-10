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
        <th scope="col">Picked By</th>
      </tr>
      </thead>
      <tr
        v-for="player in players"
        v-bind:class="{increased: player.score_diff > 0, decreased: player.score_diff < 0}"
        v-bind:key="player.tournament_id">
        <td>{{player.first_name}} {{player.last_name}}</td>
        <td>{{zeroOr(player.to_par)}}</td>
        <td>{{zeroOr(player.today)}}</td>
        <td>{{getPenaltyColumn(player)}}</td>
        <td>{{getPickThru(player)}}</td>
        <td>{{player.position || ''}}</td>
        <td>{{getParticipantsForPlayer(player)}}</td>
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
      ...DisplayUtils,
    };
  },
  async created() {
    await this.fetchData();
    await this.reload();
    this.interval = setInterval(() => this.reload(), 30000);
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const data = await ScoreboardService.load();
      this.playersToPoolParticipants = data.playersToPoolParticipants;
      this.players = data.orderedPlayers;
    },
    async reload() {
      this.refreshTime = Date.now() + 30000;
      this.loading = true;
      const data = await ScoreboardService.reload();
      this.players = data.players;
      this.poolParticipants = data.poolParticipants
        .map((p) => {
          const participant = p;
          participant.picks = participant.picks
            .map(pick => this.players[pick.tournament_id])
            .filter(x => x);
          return participant;
        });
      this.loading = false;
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

  .decreased{
    color: green;
  }
</style>
