<template>
  <tbody>
  <tr v-on:click="toggleShowPlayers" class="pool_participants">
    <td
      class="player-name-cell"
    >{{participant.name}}
    </td>
    <td>{{participant.total}}</td>
    <td>{{participant.today}}</td>
    <td>{{getTotalPenalty(participant)}}</td>
    <td class="player-thru-cell">
      <small>({{getTotalThru(participant)}} remaining)</small>
    </td>
  </tr>
  <tr
    v-show="showPlayers || showPlayersOverride"
    v-for="pick in sortedPicks(participant.picks)"
    v-bind:class="{increased: pick.score_diff > 0, decreased: pick.score_diff < 0}"
    v-bind:key="pick.id">
      <td
        class="player-name-cell">
        <a
          class="player-name"
          rel="noreferrer"
          target="_blank"
          :href="`https://www.masters.com/en_US/players/player_${pick.id}.html`">
          {{pick.first_name}} {{pick.last_name}}
        </a>
      </td>
      <td>
        {{zeroOr(pick.to_par)}} <i class="fas fa-cut"
                                   v-if="cutLine && displayPlayerCut(cutLine, pick)"></i>
      </td>
      <td>
        <span v-if="!cutLine && displayPlayerCut(cutLine, pick)"><i class="fas fa-cut"></i></span>
        <span v-if="cutLine || !displayPlayerCut(cutLine, pick)">{{zeroOr(pick.today)}}</span>
      </td>
      <td>
        {{getPenaltyColumn(pick)}}
        <i v-if="getPenaltyColumn(pick) < 0" class="fas fa-trophy"></i>
      </td>
      <td class="player-thru-cell">{{getPickThru(pick, timeInformation)}}</td>
  </tr>
  </tbody>
</template>
<script>
  import {mapGetters} from 'vuex';
  import {DisplayUtils} from '../common/displayUtils';
  import {ApiService} from '../common/api';

  export default {
    name: 'PoolParticipant',
    props: ['participant', 'showPlayers', 'cutLine', 'timezone'],
    data() {
      return {
        showPlayersOverride: false,
        ...DisplayUtils,
      };
    },
    computed: {
      ...mapGetters({
        timeInformation: 'getTimeInformationForActiveTournament',
      }),
    },
    methods: {
      toggleShowPlayers() {
        this.showPlayersOverride = !this.showPlayersOverride;
      },
    },
  };
</script>
<style scoped>
  .pool_participants td {
    cursor: pointer;
  }

  .fa-cut {
    transform: rotate(180deg);
  }

  .pool_participants td {
    font-weight: bold;
    color: var(--body-text);
    border: 0px;
  }

  .player-name {
    padding-left: 1.5rem;
    display: block;
  }

  .timezone-indicator {
    font-weight: normal;
    font-size: smaller;
  }

</style>
