<template>
  <div>
<!--    <weather-component></weather-component>-->
    <h1> Leaderboard</h1>
    <div
      class="table-options"
      v-on:click="tableCondensed = !tableCondensed">
<!--      <div v-if="!tableCondensed">-->
<!--        Condensed view-->
<!--      </div>-->
<!--      <div v-if="tableCondensed">-->
<!--        Spacious view-->
<!--      </div>-->
      <div v-if="cutLine">
        Cut Line: {{cutLine}}
      </div>
    </div>
    <table class="table"
    v-bind:class="{condensed: tableCondensed}">
      <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Total</th>
        <th scope="col">Today</th>
        <th scope="col">Penalty</th>
        <th scope="col">Thru</th>
        <th scope="col">Pos</th>
        <th scope="col">Tier</th>
        <th class="d-none d-sm-table-cell" scope="col">Picked By</th>
      </tr>
      </thead>
      <tbody
        v-for="player in players"
        v-bind:class="{increased: player.score_diff > 0, decreased: player.score_diff < 0}"
        v-bind:key="player.tournament_id">
      <tr v-if="player.firstCut">
        <td colspan="8" class="cutLine"> <i class="fas fa-cut"></i>
          <span v-if="cutLine"> Cut Line </span>
          <span v-if="!cutLine"> The following players were cut </span>
          <i class="fas fa-cut"></i></td>
      </tr>
      <tr>
        <td
          class="player-name-cell"
        ><a
          rel="noreferrer"
          target="_blank"
          :href="`https://www.masters.com/en_US/scores/track/hole_view/index.html?pid=${player.id}`">
          {{player.first_name}} {{player.last_name}}
        </a>
        </td>
        <td>
          {{zeroOr(player.to_par)}}
        </td>
        <td>
          <span v-if="!cutLine && displayPlayerCut(cutLine, player)"><i class="fas fa-cut" ></i></span>
          <span v-if="cutLine || !displayPlayerCut(cutLine, player)">{{zeroOr(player.today)}}</span>
        </td>
        <td>{{getPenaltyColumn(player)}}</td>
        <td>{{getPickThru(player)}}</td>
        <td>{{player.position || ''}}</td>
        <td>{{player.tier || ''}}</td>
        <td class="d-none d-sm-table-cell">
          <participant-names v-bind:participants="getParticipantsForPlayer(player)">
          </participant-names>
        </td>
      </tr>
      </tbody>
    </table>
    <coloring-key></coloring-key>
  </div>
</template>

<script>
import { ScoreboardService } from '../common/scoreboard';
import { DisplayUtils } from '../common/displayUtils';
import ParticipantNameCell from '@/components/ParticipantNameCell.vue';
import ColoringKeyComponent from '@/components/ColoringKeyComponent.vue';
import WeatherComponent from '@/components/WeatherComponent.vue';

const REFRESH_INTERVAL = 10000;
export default {
  name: 'PlayerLeaderboardComponent',
  components: {
    'participant-names': ParticipantNameCell,
    'coloring-key': ColoringKeyComponent,
    'weather-component': WeatherComponent,
  },
  data() {
    return {
      cutLine: '',
      players: {},
      tableCondensed: true,
      playersToPoolParticipants: {},
      refreshTime: 0,
      currentTime: Date.now(),
      ...DisplayUtils, //
    };
  },
  async created() {
    await this.fetchData();
    this.interval = setInterval(() => this.fetchData(), REFRESH_INTERVAL);

    // clock for refresh timer
    this.clock = setInterval(() => this.tick(), 1000);
  },
  async beforeDestroy() {
    clearInterval(this.interval);
    clearInterval(this.clock);
  },
  methods: {
    async fetchData() {
      this.refreshTime = Date.now() + REFRESH_INTERVAL;
      const data = await ScoreboardService.load();
      this.cutLine = data.cutLine;
      this.playersToPoolParticipants = data.playersToPoolParticipants;
      this.players = data.orderedPlayers;
    },
    getParticipantsForPlayer(player) {
      if (this.playersToPoolParticipants.hasOwnProperty(player.id)) {
        return this.playersToPoolParticipants[player.id];
      }
      return '';
    },
    tick() {
      this.currentTime = Date.now();
    },
  },
};
</script>

<style scoped>
  .table-options{
    display: flex;
    justify-content: flex-end;
  }

  .player-name-cell {
    text-align: left;
  }

  .cutLine {
    background-color: #46586A;
    color: white;
  }
</style>
