<template>
  <tbody>
  <tr v-on:click="moreInfo" class="pool_participants">
    <td class="player-name-cell">
      <a rel="noreferrer"
      target="_blank"
      :href="`https://www.masters.com/en_US/scores/track/hole_view/index.html?pid=${player.id}`">
      {{player.first_name}} {{player.last_name}}
    </a>
    </td>
    <td>{{zeroOr(player.to_par)}}</td>
    <td>{{zeroOr(player.today)}}</td>
    <td>{{getPenaltyColumn(player)}}</td>
    <td>{{getPickThru(player)}}</td>
    <td>{{player.position || ''}}</td>
    <td class="d-none d-sm-table-cell">{{player.pickedBy.length}} </td>
  </tr>
  </tbody>
</template>

<script>
import { DisplayUtils } from '../common/displayUtils';

export default {
  name: 'PlayerComponent',
  props: ['player'],
  data: () => ({
    ...DisplayUtils,
  }),
  methods: {
    moreInfo() {
      console.log('test');
    },
  },
};
</script>

<style scoped>

</style>
