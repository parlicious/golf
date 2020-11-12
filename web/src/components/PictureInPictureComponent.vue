<template>
  <div
    v-show="!hidden"
    id="pip-player"
    v-bind:class="{floating: this.floating, fixed: !this.floating}"
    ref="pipPlayer"
    :style="getPosition()"
    @mousedown.left="startDrag">
    <div id="title-bar">
      <div id="foo"></div>
      <div id="close-text" v-on:click="close()">
          Close
      </div>
    </div>
    <iframe
      :src="srcUrl"
      :height="200"
      :width="360"
      frameborder="0"
      scrolling="no"
      allowfullscreen="true">
    </iframe>
  </div>
</template>

<script>
export default {
  name: 'PictureInPictureComponent.vue',
  data() {
    return {
      hidden: false,
      srcUrl: '',
      dragging: false,
      x: 40,
      y: window.innerHeight - 300,
      offX: 0,
      offY: 0,
    };
  },
  methods: {
    close() {
      this.hidden = true;
    },
    startDrag(event) {
      this.dragging = true;
      this.offX = this.x - event.clientX;
      this.offY = this.y - event.clientY;
    },
    stopDrag() {
      this.dragging = false;
    },
    doDrag(event) {
      if (this.dragging) {
        this.x = event.clientX + this.offX;
        this.y = event.clientY + this.offY;
      }
    },
    getPosition() {
      const pos = {
        top: `${this.y}px`,
        left: `${this.x}px`,
      };
      return pos;
    },
  },
  mounted() {
    window.addEventListener('mouseup', this.stopDrag);
    window.addEventListener('mousemove', this.doDrag);
    this.srcUrl = `https://player.twitch.tv/?channel=lizzastreaming&parent=${window.location.hostname}`;
  },
};
</script>

<style scoped>

  /*#participantOverlay {*/
  /*  position: absolute;*/
  /*  top: 0*/
  /*}*/

  #exit-fullscreen {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100000;
    color: #cccccc;
  }

  .participant-select {
    display: flex;
    justify-content: space-between;
  }

  #pip-player.floating {
    position: absolute;
    width: 180px;
    height: 100px;
  }

  #pip-player.fixed {
    position: absolute;
    width: 85vw;
    left: calc(15vw / 2);
  }

  #title-bar {
    width: 360px;
    background: #2e2e2e;
    height: 2em;
    cursor: grab;
    padding-right: 0.5em;
    display: flex;
    flex-direction: row;
    justify-content: end;
  }

  #close-text {
    text-align: end;
    width: 5em;
    cursor: pointer;
    right: 0;
  }

  #foo {
    flex-basis: 80%;
  }

  .full {
    left: 0 !important;
    top: 0 !important;
  }

  #dummy {
    width: 100%;
    margin: auto;
    padding-top: calc(591.44 / 1127.34 * 100%);
  }
</style>
