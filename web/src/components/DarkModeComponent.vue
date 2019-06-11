<template>
  <div v-on:click="toggleDarkMode()">
    <i v-if="darkMode"
       class="far fa-lightbulb">
    </i>
    <i v-if="!darkMode"
       class="fas fa-lightbulb">
    </i>
  </div>
</template>

<script>
export default {
  name: 'DarkModeComponent',
  data() {
    return {
      darkMode: false,
    };
  },
  mounted() {
    if (localStorage.darkMode) {
      this.darkMode = JSON.parse(localStorage.darkMode);
    }
    this.applyTheme(this.darkMode);
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.darkMode = this.darkMode;
      this.applyTheme(this.darkMode);
    },
    applyTheme(darkMode) {
      console.log(`DarkMode: ${darkMode}`);
      if (darkMode) {
        document.body.setAttribute('data-theme', 'dark');
        console.log('Dark Mode is on.');
      } else {
        document.body.setAttribute('data-theme', 'light');
        console.log('Dark Mode is off.');
      }
    },
  },
};
</script>

<style scoped>

</style>
