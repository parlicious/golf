<template>
  <tbody>
  <tr v-on:click="showPlayers = !showPlayers">
    <td> 0 </td>
    <td>{{participant.name}}</td>
    <td>{{participant.total}}</td>
    <td>{{participant.today}}</td>
    <td> F </td>
  </tr>
  <tr
    v-show="showPlayers"
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
  props: ['participant'],
  data() {
    return {
      showPlayers: true,
    };
  },
};
</script>
