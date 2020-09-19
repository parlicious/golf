<template>
  <div id="app">
    <div id="nav">
      <router-link to="/standings">Standings</router-link>
      <router-link to="/leaderboard">Leaderboard</router-link>
      <router-link to="/picks">Picks</router-link>
      <router-link to="/stream">Stream</router-link>
      <router-link to="/history">History</router-link>
    </div>
    <router-view/>
    <DarkModeComponent/>
  </div>
</template>

<script>
import DarkModeComponent from './components/DarkModeComponent.vue';

export default {
  name: 'App',
  components: {
    DarkModeComponent,
  },
};
</script>


<style>

  :root {

    color-scheme: light dark;

    --cyan: #7FC1CA;
    --blue: #83AFE5;
    --purple: #9A93E1;
    --pink: #D18EC2;
    --red: #DF8C8C;
    --orange: #F2C38F;
    --yellow: #DADA93;
    --green: #A8CE93;

    --gray0: #171717;
    --gray1: #171717;
    --gray2: #2E2E2E;
    --gray3: #525252;
    --gray4: #6B6B6B;
    --gray5: #8C8C8C;
    --gray6: #8C8C8C;

    --sonic0: #434662;
    --sonic1: #434662;
    --sonic2: #726A8F;
    --sonic3: #B190A1;
    --sonic4: #F1C3BB;
    --sonic5: #FFE2CF;
    --sonic6: #FFE2CF;


    --water1: #E7E8EA;
    --water2: #ADC8D9;
    --water5: #3F66A3;
    --water6: #193773;

    --vapor1: #0c056d;
    --vapor2: #590d82;
    --vapor5: #b61aae;
    --vapor6: #f25d9c;


    --light-body-text: #2C3E50;
    --light-background: #FFFFFF;
    --light-nav-button-bg: #42b983;
    --light-nav-button-text: #FFFFFF;

    --light-expand-button-color: #ffffff;
    --light-exapnd-button-bg-color: #35495e;

    --danger-color: #721c24;
    --danger-background-color: #f8d7da;
    --danger-border-color: #f5c6cb;

    --success-color: #155724;
    --success-background-color: #d4edda;
    --success-border-color: #c3e6cb;

    --table-header-text-color: #46586A;
    --table-row-hover: #eee;
    --td-th-border-top: #dee2e6;

    --body-text: var(--light-body-text);
    --link-color: #007BFF;
    --background: var(--light-background);

    --nav-button-bg: var(--light-nav-button-bg);
    --nav-button-text: var(--light-nav-button-text);

    --expand-button-color: var(--light-expand-button-color);
    --expand-button-bg-color: var(--light-exapnd-button-bg-color);

    --cut-line-bg-color: var(--table-header-text-color);
    --cut-line-color: var(--light-nav-button-text);
  }

  [data-theme="dark"] {
    --body-text: var(--gray5);
    --background: var(--gray1);
    --nav-button-bg: var(--gray6);
    --nav-button-text: var(--gray1);
    --table-row-hover: var(--gray2);
    --td-th-border-top: var(--gray2);

    --link-color: var(--orange);

    --expand-button-color: var(--gray1);
    --expand-button-bg-color: var(--gray5);

    --cut-line-bg-color: var(--gray5);
    --cut-line-color: var(--gray1);
  }

  [data-theme="sonic"] {
    --body-text: var(--sonic5);
    --background: var(--sonic1);
    --nav-button-bg: var(--sonic6);
    --nav-button-text: var(--sonic1);
    --table-row-hover: var(--sonic2);
    --td-th-border-top: var(--sonic2);

    --link-color: var(--orange);

    --expand-button-color: var(--sonic1);
    --expand-button-bg-color: var(--sonic5);

    --cut-line-bg-color: var(--sonic5);
    --cut-line-color: var(--sonic1);
  }

  [data-theme="vaporwave"] {
    --body-text: var(--vapor5);
    --background: var(--vapor1);
    --nav-button-bg: var(--vapor6);
    --nav-button-text: var(--vapor1);
    --table-row-hover: var(--vapor2);
    --td-th-border-top: var(--vapor2);

    --link-color: var(--vapor6);

    --expand-button-color: var(--vapor1);
    --expand-button-bg-color: var(--vapor5);

    --cut-line-bg-color: var(--vapor5);
    --cut-line-color: var(--vapor1);
  }

  [data-theme="beach"] {
    --beach1: #fdcb9e;
    --beach2: #0f4c75;
    --beach5: #00b7c2;
    --beach6: #1b262c;

    --body-text: var(--beach5);
    --background: var(--beach1);
    --nav-button-bg: var(--beach6);
    --nav-button-text: var(--beach1);
    --table-row-hover: var(--beach2);
    --td-th-border-top: var(--beach2);

    --link-color: var(--beach6);

    --expand-button-color: var(--beach1);
    --expand-button-bg-color: var(--beach5);

    --cut-line-bg-color: var(--beach5);
    --cut-line-color: var(--beach1);
  }

  [data-theme="water"] {
    --body-text: var(--water5);
    --background: var(--water1);
    --nav-button-bg: var(--water6);
    --nav-button-text: var(--water1);
    --table-row-hover: var(--water2);
    --td-th-border-top: var(--water2);

    --link-color: var(--purple);

    --expand-button-color: var(--water1);
    --expand-button-bg-color: var(--water5);

    --cut-line-bg-color: var(--water5);
    --cut-line-color: var(--water1);
  }

  /*@media (prefers-color-scheme: dark) {*/
  /*  :root {*/
  /*    --body-text: var(--gray5);*/
  /*    --background: var(--gray1);*/

  /*    --nav-button-bg: var(--gray6);*/
  /*    --nav-button-text: var(--gray1);*/

  /*    --table-row-hover: var(--gray2);*/
  /*    --td-th-border-top: var(--gray2);*/
  /*  }*/
  /*}*/

  #bootstrap-overrides {
    color: var(--body-text);
    background-color: var(--background);
  }

  #bootstrap-overrides .table {
    color: var(--body-text);
  }

  #bootstrap-overrides .table tbody {
    border-bottom: 2px solid var(--td-th-border-top);
  }

  #bootstrap-overrides .table thead th {
    border-bottom: 2px solid var(--td-th-border-top);
  }

  tr:hover {
    background-color: var(--table-row-hover);
  }

  #bootstrap-overrides .table td, #bootstrap-overrides .table th {
    border-top: 1px solid var(--td-th-border-top);
  }

  #bootstrap-overrides a {
    color: var(--link-color);
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    max-width: 1000px;
    margin: 0 auto !important;
    padding: .75rem;
  }

  #nav {
    padding: 30px 10px 10px 10px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  #nav a {
    font-weight: bold;
    color: var(--body-text);
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: .25rem;
    margin: .25rem;
  }

  #nav a.router-link-exact-active {
    background-color: var(--nav-button-bg);
    color: var(--nav-button-text);
  }

  .condensed td {
    padding: .1rem !important;
  }

  .condensed th {
    padding-left: .1rem !important;
    padding-right: .1rem !important;
    /*background-color: #92A4B6;*/
    /*color: white;*/
    /*color: #92A4B6;*/
  }

  .player-name-cell {
    text-align: left;
  }

  .player-thru-cell {
    text-align: right;
  }

  .increased {
    color: var(--danger-color);
    background-color: var(--danger-background-color);
    border-color: var(--danger-border-color);
  }


  #bootstrap-overrides .increased a {
    color: var(--danger-color);
    background-color: var(--danger-background-color);
    border-color: var(--danger-border-color);
  }

  #bootstrap-overrides .decreased a {
    color: var(--success-color);
    background-color: var(--success-background-color);
    border-color: var(--success-border-color);
  }

  .decreased {
    color: var(--success-color);
    background-color: var(--success-background-color);
    border-color: var(--success-border-color);
  }

  .increased:hover, .increased tr:hover {
    background-color: var(--danger-background-color);
  }

  #bootstrap-overrides tbody.increased {
    border-bottom: 2px solid var(--danger-border-color);
  }

  #bootstrap-overrides tbody.decreased {
    border-bottom: 2px solid var(--success-border-color);
  }

  .decreased:hover, .decreased tr:hover {
    background-color: var(--success-background-color);
  }

  .color-mode-button {
    cursor: pointer;
    color: #35495e;
    font-weight: bold;
    border-radius: 5px;
    margin: .25rem;
    padding-left: .4rem;
    padding-right: .4rem;
    text-align: center;
    border: 3px #35495e solid;
  }
</style>
