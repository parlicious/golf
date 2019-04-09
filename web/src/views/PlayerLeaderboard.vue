<template>
  <div class="home">
    <PlayerLeaderboardComponent/>
  </div>
</template>

<script>
// @ is an alias to /src
import PlayerLeaderboardComponent from '../components/PlayerLeaderboardComponent.vue';

export default {
  name: 'leaderboard',
  components: {
    PlayerLeaderboardComponent,
  },
};
</script>
