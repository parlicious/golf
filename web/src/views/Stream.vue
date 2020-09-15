<template>
  <div id="player" ref="player">
    <iframe
      src="https://player.twitch.tv/?channel=lizzastreaming&parent=parlicious.com"
      :height="height"
      :width="width"
      frameborder="0"
      scrolling="no"
      allowfullscreen="true">
    </iframe>
    <div id="dummy"/>
  </div>
</template>

<script>

export default {
  name: 'Stream.vue',
  data() {
    return {
      height: 0,
      width: 0,
    };
  },
  methods: {
    matchHeight() {
      if (this.$refs.player) {
        this.height = this.$refs.player.clientHeight;
        this.width = this.$refs.player.clientWidth;
      }
    },
  },
  mounted() {
    this.matchHeight();
  },
};
</script>

<style scoped>
  #player {
    width: 100%;
    margin: auto;
  }

  #dummy {
    width: 100%;
    margin: auto;
    padding-top: calc(591.44 / 1127.34 * 100%);
  }
</style>
