<template>
  <div>
    <div class="banner banner-container" :style="bannerColumnsCss">
      <slot></slot>
    </div>

    <div class="banner banner-container-offset" :style="bannerColumnsCss">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BannerComponent.vue',
  props: ['numChildren', 'scrollTime', 'placement'],
  computed: {
    bannerColumnsCss() {
      return `
        grid-template-columns: repeat(${this.numChildren}, 1fr);
        top: ${this.placement === 'top' ? 0 : 'auto'};
        bottom: ${this.placement === 'bottom' ? 0 : 'auto'};
      `;
    },
  },
};
</script>

<style scoped>

@keyframes translate {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-550vw, 0);
  }
}

.banner {
  animation: translate 90s linear infinite;
  background-color: #2f3136;
  left: 0;
  position: absolute;
  width: 550vw;
  display: grid;
  font-weight: bold;
}

.banner-container {
  margin-left: 0;
}

.banner-container-offset {
  margin-left: 549.9vw;
}
</style>
