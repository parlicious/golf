<template>
  <div id="app" >
    <div id="nav">
      <router-link to="/standings">Standings</router-link>
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
  padding: 30px 10px 10px 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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

.refresh-label{
  color: #aaa
}

.condensed td{
  padding: .1rem !important;
}

.condensed th{
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

  tr:hover {
    background-color: #eee;
  }

.increased{
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.increased a{
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.decreased{
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.decreased a{
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.color-mode-button{
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
