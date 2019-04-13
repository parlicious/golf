<template>
  <div class="post">
    <weather-component></weather-component>
    <div class="hello">
      <h1> Standings </h1>
    </div>
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="leaderboardActive">
      <div class="condense-expand">
        <div
          class="expand-button"
          v-if="showAll"  v-on:click="showAll = !showAll">
          Collapse All
        </div>
        <div v-if="!showAll" v-on:click="showAll = !showAll"
             class="expand-button">
          Expand All
        </div>
       <div v-if="cutLine">
         Cut Line: {{cutLine}}
       </div>
      </div>
      <div v-if="!loading" class="content">
        <table class="table" v-bind:class="{condensed: tableCondensed}">
          <thead>
          <tr>
            <th class="player-name-cell" scope="col">Name</th>
            <th scope="col">Total</th>
            <th scope="col">Today</th>
            <th scope="col">Penalty</th>
            <th scope="col">Tier</th>
            <th class="player-thru-cell" scope="col">Thru</th>
          </tr>
          </thead>
          <pool-participant
            v-for="participant in poolParticipants"
            v-bind:key="participant.name"
            v-bind:showPlayers="showAll"
            v-bind:cutLine="cutLine"
            v-bind:participant="participant">
          </pool-participant>
        </table>
        <coloring-key></coloring-key>
<!--        <div class="show-best-possible">-->
<!--          <small v-if="!showBestPicks"-->
<!--                 v-on:click="showBestPicks = !showBestPicks">-->
<!--            <i class="far fa-star"></i>-->
<!--            Show best possible picks-->
<!--          </small>-->
<!--          <small v-if="showBestPicks"-->
<!--                 v-on:click="showBestPicks = !showBestPicks">-->
<!--            <i class="fas fa-star"></i>-->
<!--            Hide best possible picks-->
<!--          </small>-->
<!--        </div>-->
      </div>
    </div>

    <div v-if="!leaderboardActive">
      <p> The leaderboard will be available when the tournament begins</p>
    </div>
  </div>
</template>

<script>
import { ScoreboardService } from '../common/scoreboard';
import PoolParticipantComponent from '@/components/PoolParticipantComponent.vue';
import ColoringKeyComponent from '@/components/ColoringKeyComponent.vue';
import WeatherComponent from '@/components/WeatherComponent.vue';


const REFRESH_INTERVAL = 10000;

export default {
  name: 'LeaderboardComponent',
  components: {
    'pool-participant': PoolParticipantComponent,
    'coloring-key': ColoringKeyComponent,
    'weather-component': WeatherComponent,
  },
  data() {
    return {
      cutLine: '',
      loading: false,
      showAll: false,
      showBestPicks: false,
      tableCondensed: true,
      leaderboardActive: true,
      refreshTime: 0,
      currentTime: Date.now(),
      players: {},
      poolParticipants: [],
    };
  },
  async created() {
    // fetch the data when the view is created and the data is
    // already being observed
    await this.fetchData();
    this.interval = setInterval(() => this.fetchData(), REFRESH_INTERVAL);

    // clock for refresh timer
    this.clock = setInterval(() => this.tick(), 1000);
  },
  async beforeDestroy() {
    clearInterval(this.interval);
    clearInterval(this.clock);
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
  },
  methods: {
    async fetchData() {
      this.refreshTime = Date.now() + REFRESH_INTERVAL;
      const data = await ScoreboardService.load();
      this.cutLine = data.cutLine;
      this.players = data.players;
      this.poolParticipants = data.poolParticipants
        .map((p) => {
          const participant = p;
          participant.picks = participant.picks
            .map(pick => this.players[pick.tournament_id])
            .filter(x => x);
          return participant;
        });
    },
    tick() {
      this.currentTime = Date.now();
    },
    toggleBestPossiblePicks() {
      this.showBestPicks = !showBestPicks;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .condense-expand{
    display: flex;
    justify-content: space-between;
  }

  .expand-button{
    cursor: pointer;
    background-color: #35495e;
    color: #ffffff;
    font-weight: bold;
    border-radius: 5px;
    margin: .25rem;
    padding-left: .4rem;
    padding-right: .4rem;
    text-align: center;
  }

  .participant-name:hover{
    background-color: #4F6378;
  }
</style>
