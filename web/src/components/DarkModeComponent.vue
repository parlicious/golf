<template>
  <div class="dark-mode-toggle">
    <i v-on:click="setTheme('dark')"
       class="fas fa-moon">
    </i>
    <i v-on:click="setTheme('sonic')"
       class="fas fa-bolt">
    </i>
    <i v-on:click="setTheme('light')"
       class="fas fa-sun">
    </i>
    <i v-on:click="setTheme('autumn')"
       class="fas fa-leaf">
    </i>
  </div>
</template>

<script>
import figlet from 'figlet';
import big from 'figlet/importable-fonts/Big.js';

figlet.defaults({ fontPath: `${window.location.origin}/fonts/` });

export default {
  name: 'DarkModeComponent',
  data() {
    return {
      theme: 'light',
      themesList: [
        'light',
        'dark',
        'sonic',
        'water',
        'vaporwave',
        'beach',
      ],
    };
  },
  mounted() {
    if (localStorage.theme) {
      this.theme = localStorage.theme;
    }
    if (localStorage.darkMode && !localStorage.theme) {
      this.theme = 'dark';
    }

    if (this.$route.query.theme) {
      this.theme = this.$route.query.theme;
    }

    const ascii = `
     '\\                   .  .                        |>18>>
       \\              .         ' .                   |
      O>>         .                 'o                |
       \\       .                                      |
       /\\    .                                        |
      / /  .'                                         |
jgs^^^^^^^\`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    `;

    figlet.parseFont('big', big);
    figlet.text('Parlicious', {
      font: 'big',
    }, (err, data) => {
      console.log(data);
      console.log(ascii);
      const themes = this.themesList.map(t => `'${t}'`).join(' ');
      console.log(`Call setTheme with any of the following themes to change your theme:\n${themes}`);
      console.log('Call \`wrongMode\` to swap increase and decrease colors');
    });

    this.applyTheme(this.theme);
  },
  methods: {
    setTheme(theme) {
      this.theme = theme;
      localStorage.theme = this.theme;
      this.applyTheme(this.theme);
    },
    applyTheme(theme) {
      document.body.setAttribute('data-theme', theme);
    },
  },
};

window.setTheme = (theme) => {
  localStorage.theme = theme;
  document.body.setAttribute('data-theme', theme);
};

window.wrongMode = () => {
  document.body.setAttribute('data-movement-theme', 'inverted');
};
</script>

<style scoped>
  .dark-mode-toggle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 50%;
    max-width: 300px;
    margin: auto;
    padding: .5rem;
  }
</style>
