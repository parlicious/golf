<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <PicksComponent msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import PicksComponent from '@/components/PicksComponent.vue';

export default {
  name: 'home',
  components: {
    PicksComponent,
  },
};
</script>
