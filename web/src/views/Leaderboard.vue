<template>
  <div class="home">
    <LeaderboardComponent/>
  </div>
</template>

<script>
// @ is an alias to /src
import LeaderboardComponent from '../components/LeaderboardComponent.vue';

export default {
  name: 'leaderboard',
  components: {
    LeaderboardComponent,
  },
  async created() {
    this.$store.dispatch('initTournament');
  },
};
</script>
