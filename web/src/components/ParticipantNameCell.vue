<template>
  <div class="participant-names">
    <span class="participant-name"
    v-for="participant in participants"
          v-bind:id="participant"
          v-on:click="showAll = !showAll">
      {{showAll ? participant : getNameAbbreviation(participant)}}
    </span>
  </div>
</template>

<script>
import { DisplayUtils } from '../common/displayUtils';

export default {
  name: 'ParticipantNameCell.vue',
  props: ['participants'],
  data() {
    return {
      showAll: false,
    };
  },
  methods: {
    ...DisplayUtils,
  },
};
</script>

<style scoped>
  .participant-names{
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .participant-name{
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #35495e;
    color: #ffffff;
    font-weight: bold;
    border-radius: 5px;
    margin: .1rem;
    padding-left: .4rem;
    padding-right: .4rem;
    text-align: center;
  }

  .participant-name:hover{
    background-color: #4F6378;
  }
</style>
