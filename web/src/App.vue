<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/standings">Pool Standings</router-link>
      <router-link to="/leaderboard">Leaderboard</router-link>
      <router-link to="/picks">Picks</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 1000px;
  margin: 0 auto !important;
}
#nav {
  padding: 30px;
  /*display: flex;*/
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding:1rem;
  border: 1px solid #ccc;
  border-radius:.25rem;
  margin:.25rem;
}

#nav a.router-link-exact-active {
  background-color: #42b983;
  color:white;
}
.home {
  padding: .75rem;
}
</style>
