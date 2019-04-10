<template>
  <tbody>
  <tr v-on:click="toggleShowPlayers" class="pool_participants">
    <td>{{participant.name}}</td>
    <td>{{participant.total}}</td>
    <td>{{participant.today}}</td>
    <td>{{getTotalPenalty(participant)}}</td>
    <td></td>
  </tr>
  <tr
    v-show="showPlayers || showPlayersOverride"
    v-for="pick in sortedPicks(participant.picks)"
    v-bind:key="pick.last_name">
    <td>{{pick.first_name}} {{pick.last_name}}</td>
    <td>{{zeroOr(pick.to_par)}}</td>
    <td>{{zeroOr(pick.today)}}</td>
    <td>{{getPenaltyColumn(pick)}}</td>
    <td>{{getPickThru(pick)}}</td>
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

</style>
