<template>
  <div class="post">
    <weather-component></weather-component>
    <div class="hello">
      <h1>{{tournamentName}} <span class="light">Standings</span></h1>
    </div>
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="leaderboardActive">
      <div class="condense-expand">
       <div v-if="cutLine">
         Cut Line: {{cutLine}}
       </div>
        <div v-if="projectedCutLine">
          Projected Cut Line: {{projectedCutLine}}
        </div>
      </div>
      <div v-if="!loading" class="content">
        <table class="table" v-bind:class="{condensed: tableCondensed}">
          <thead>
          <tr>
            <th class="player-name-cell" scope="col">
              <div class="expand-button" v-if="showAll"  v-on:click="showAll = !showAll">
                  <i class="far fa-minus-square"></i>
                  Collapse All
              </div>
              <div v-if="!showAll" v-on:click="showAll = !showAll" class="expand-button">
                <i class="far fa-plus-square"></i>
                Expand All
              </div>
              <div>Name</div>
            </th>
            <th scope="col">Total</th>
            <th scope="col">Today</th>
            <th scope="col">Penalty</th>
            <th class="player-thru-cell" scope="col">Thru</th>
          </tr>
          </thead>
          <pool-participant
            v-for="participant in poolParticipants"
            v-bind:key="participant.name"
            v-bind:showPlayers="showAll"
            v-bind:cutLine="cutLine"
            v-bind:timezone="timezone"
            v-bind:participant="participant">
          </pool-participant>
        </table>
        <coloring-key></coloring-key>
      </div>
    </div>

    <div v-if="!leaderboardActive">
      <p> The leaderboard will be available when the tournament begins</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PoolParticipantComponent from '@/components/PoolParticipantComponent.vue';
import ColoringKeyComponent from '@/components/ColoringKeyComponent.vue';
import WeatherComponent from '@/components/WeatherComponent.vue';
import {simulateRemainingScores} from "../common/scoreboard";

export default {
  name: 'LeaderboardComponent',
  components: {
    'pool-participant': PoolParticipantComponent,
    'coloring-key': ColoringKeyComponent,
    'weather-component': WeatherComponent,
  },
  data() {
    return {
      loading: false,
      showAll: false,
      showBestPicks: false,
      tableCondensed: true,
      leaderboardActive: true,
    };
  },
  mounted() {

  },
  computed: {
    ...mapGetters({
      tournamentName: 'getTournamentName',
      cutLine: 'getCutLine',
      projectedCutLine: 'getProjectedCutLine',
      players: 'getPlayers',
      timezone: 'getTimezone',
      poolParticipants: 'getPoolParticipantsWithFullPicks',
    }),
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
    background-color: transparent;
    color: var(--expand-button-bg-color);;
    font-weight: bold;
    border-radius: 5px;
    padding: 10px 0px;
    text-align: left;

    font-size: 10px;
    font-weight: 300;
  }

  .participant-name:hover{
    background-color: #4F6378;
  }
</style>
