<template>
  <div class="home">
    <StandingsComponent/>
  </div>
</template>

<script>
import StandingsComponent from '../components/StandingsComponent.vue';

export default {
  name: 'Standings',
  components: {
    StandingsComponent,
  },
  async created() {
    await this.$store.dispatch('initTournament');
  },
};
</script>
