<template>
  <tbody>
  <tr v-on:click="toggleShowPlayers" class="pool_participants">
    <td
      class="player-name-cell"
    >{{participant.name}}</td>
    <td>{{participant.total}}</td>
    <td>{{participant.today}}</td>
    <td>{{getTotalPenalty(participant)}}</td>
    <td class="player-thru-cell">
      {{180 - getTotalThru(participant)}} <small>⛳️ left</small>
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
      :href="`https://www.masters.com/en_US/scores/track/hole_view/index.html?pid=${pick.id}`">
      {{pick.first_name}} {{pick.last_name}}
    </a>
    </td>
    <td>{{zeroOr(pick.to_par)}}</td>
    <td>{{zeroOr(pick.today)}}</td>
    <td>{{getPenaltyColumn(pick)}}</td>
    <td class="player-thru-cell">{{getPickThru(pick)}}</td>
  </tr>
  </tbody>
</template>
<script>
import { DisplayUtils } from '../common/displayUtils';

export default {
  name: 'PoolParticipant',
  props: ['participant', 'showPlayers'],
  data() {
    return {
      showPlayersOverride: false,
      ...DisplayUtils,
    };
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

  .pool_participants td {
    font-weight: bold;
  }

  .player-name {
    padding-left: 1.5rem;
    display: block;
  }

  .increased{
    color: red;
  }

  .increased a{
    color: red;
  }

  .decreased{
    color: green;
  }

  .decreased a{
    color: green;
  }

</style>
