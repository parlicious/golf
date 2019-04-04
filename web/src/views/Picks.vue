<template>
  <div class="home">
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
