<template>
  <div class="home">
    <LeaderboardComponent msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import LeaderboardComponent from '@/components/LeaderboardComponent.vue';

export default {
  name: 'home',
  components: {
    LeaderboardComponent,
  },
};
</script>
