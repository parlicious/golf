<template>
  <tbody>
  <tr v-on:click="toggleShowPlayers">
    <td> 0 </td>
    <td>{{participant.name}}</td>
    <td>{{participant.total}}</td>
    <td>{{participant.today}}</td>
    <td> F </td>
  </tr>
  <tr
    v-show="showPlayers || showPlayersOverride"
    v-for="pick in participant.picks"
    v-bind:key="pick.last_name">
    <td> </td>
    <td>{{pick.first_name}} {{pick.last_name}} ({{pick.teetime}})</td>
    <td>{{pick.to_par}}</td>
    <td>{{pick.today}}</td>
    <td>{{pick.thru}}</td>
  </tr>
  </tbody>
</template>
<script>

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
  },
};
</script>
