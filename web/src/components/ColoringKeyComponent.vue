<template>
  <div class="coloring-key">
    <div class="coloring-key-item">
      <small>Coloring key:</small>
    </div>
    <div class="increased coloring-key-item" >
      <small>Score improved</small>
    </div>
    <div class="decreased coloring-key-item">
      <small>Score worsened</small>
    </div>
  </div>
</template>

<script>
    export default {
        name: "ColoringKeyComponent.vue"
    }
</script>

<style scoped>
  .coloring-key{
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .coloring-key-item{
    padding-left: .25rem;
    padding-right: .25rem;
  }
</style>
