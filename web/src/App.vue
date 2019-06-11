<template>
  <div id="app">
    <div id="nav">
      <router-link to="/standings">Standings</router-link>
      <router-link to="/leaderboard">Leaderboard</router-link>
      <router-link to="/picks">Picks</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>

  :root {
    --cyan: #7FC1CA;
    --blue: #83AFE5;
    --purple: #9A93E1;
    --pink: #D18EC2;
    --red: #DF8C8C;
    --orange: #F2C38F;
    --yellow: #DADA93;
    --green: #A8CE93;

    --gray0: #1E272C;
    --gray1: #3C4C55;
    --gray2: #556873;
    --gray3: #6A7D89;
    --gray4: #899BA6;
    --gray5: #C5D4DD;
    --gray6: #E6EEF3;


    --light-body-text: #2C3E50;
    --light-background: #FFFFFF;
    --light-nav-button-bg: #42b983;
    --light-nav-button-text: #FFFFFF;

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
    --background: var(--light-background);

    --nav-button-bg: var(--light-nav-button-bg);
    --nav-button-text: var(--light-nav-button-text);
  }

  [data-theme="dark"] {
    --body-text: var(--gray5);
    --background: var(--gray1);

    --nav-button-bg: var(--gray6);
    --nav-button-text: var(--gray1);

    --table-row-hover: var(--gray2);
    --td-th-border-top: var(--gray2);
  }

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
    color: var(--cyan);
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
