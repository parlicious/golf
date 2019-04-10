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
    <td>{{pick.to_par}}</td>
    <td>{{pick.today}}</td>
    <td>{{getPenaltyColumn(pick)}}</td>
    <td>{{getPickThru(pick)}}</td>
  </tr>
  </tbody>
</template>
<script>
const inProgressOrFinishedThruPattern = /[0-9]+|F/;

export default {
  name: 'PoolParticipant',
  props: ['participant', 'showPlayers'],
  data() {
    return {
      showPlayersOverride: false,
    };
  },
  methods: {
    toggleShowPlayers() {
      this.showPlayersOverride = !this.showPlayersOverride;
    },
    getTotalPenalty(participant) {
      return participant.picks.reduce((acc, val) => acc + this.getPenaltyColumn(val), 0);
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
    sortedPicks(picks) {
      return picks.sort((a, b) => a.to_par - b.to_par);
    },
    getPickThru(pick) {
      if (inProgressOrFinishedThruPattern.test(pick.thru)) {
        return pick.thru;
      }
      return pick.teetime;
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
