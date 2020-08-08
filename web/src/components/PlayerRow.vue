<template>
  <tr v-bind:class="{increased: player.score_diff > 0, decreased: player.score_diff < 0}"
      v-bind:key="player.id">
    <td
      class="player-name-cell">
      <!--      <a-->
      <!--        class="player-name"-->
      <!--        rel="noreferrer"-->
      <!--        target="_blank"-->
      <!--        :href="`https://www.pgatour.com/players/player.${player.id}.${player.first_name}-${player.last_name}.html/scorecards/r033/2020`">-->
      <!--        {{player.first_name}} {{player.last_name}}-->
      <!--      </a>-->
      <span v-on:click="toggleShowShots"> {{player.first_name}} {{player.last_name}} </span>
    </td>
    <td>
      {{zeroOr(player.to_par)}} <i class="fas fa-cut"
                                   v-if="cutLine && displayPlayerCut(cutLine, player)"></i>
    </td>
    <td>
      <span v-if="!cutLine && displayPlayerCut(cutLine, player)"><i class="fas fa-cut"></i></span>
      <span v-if="cutLine || !displayPlayerCut(cutLine, player)">{{zeroOr(player.today)}}</span>
    </td>
    <td>
      {{getPenaltyColumn(player)}}
      <i v-if="getPenaltyColumn(player) < 0" class="fas fa-trophy"></i>
    </td>
    <td>{{player.tier}}</td>
    <td class="player-thru-cell">{{getPickThru(player, timeInformation)}}</td>
  </tr>
</template>

<script>
  import {ApiService} from '../common/api';
  import {DisplayUtils} from "../common/displayUtils";
  import {mapGetters} from "vuex";

  export default {
    name: 'PlayerRow',
    props: ['player', 'round', 'cutLine', 'timezone'],
    async mounted() {
      // await ApiService.getShotTracker(this.round, this.player.id);
    },
    data() {
      return {
        showPlayersOverride: false,
        showShots: false,
        ...DisplayUtils,
      };
    },
    methods: {
      toggleShowShots() {
        this.showShots = !this.showShots;
      },
    },
    computed: {
      ...mapGetters({
        timeInformation: 'getTimeInformationForActiveTournament',
      }),
    },
  };
</script>

<style scoped>

</style>
