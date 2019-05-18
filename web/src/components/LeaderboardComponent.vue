<template>
  <div>
    <weather-component></weather-component>
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
          :href="`https://www.pga.com/events/pgachampionship/leaderboard/2019/?pid=${player.id}`">
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
        <td>
          {{getPenaltyColumn(player)}}
          <img v-if="getPenaltyColumn(player) < 0" src="../assets/trophy.jpg" height="20">
        </td>
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
import { DisplayUtils } from '../common/displayUtils';
import { mapGetters } from 'vuex';

import ParticipantNameCell from '@/components/ParticipantNameCell.vue';
import ColoringKeyComponent from '@/components/ColoringKeyComponent.vue';
import WeatherComponent from '@/components/WeatherComponent.vue';

export default {
  name: 'LeaderboardComponent',
  components: {
    'participant-names': ParticipantNameCell,
    'coloring-key': ColoringKeyComponent,
    'weather-component': WeatherComponent,
  },
  data() {
    return {
      tableCondensed: true,
    };
  },
  computed: {
    ...mapGetters({
      cutLine: 'getCutLine',
      players: 'getOrderedPlayers',
      playersToPoolParticipants: 'getPlayersToPoolParticipants',
    }),
  },
  async created() {
    await this.$store.dispatch('initTournament');
  },
  methods: {
    getParticipantsForPlayer(player) {
      if (Object.prototype.hasOwnProperty.call(this.playersToPoolParticipants, player.id)) {
        return this.playersToPoolParticipants[player.id];
      }
      return '';
    },
    ...DisplayUtils,
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
