<template>
  <div class="hello">
    <h1> Make Your Picks </h1>
    <div v-if="loading">
      Loading ...
    </div>
    <div v-if="!loading && selectEmail">

      <form
        @submit.prevent="getIndividualPicks"
        class="form-signin form-inline justify-content-center">
        <label class="sr-only" for="inlineFormInputName2">Email</label>
        <input
          v-model="email"
          type="text"
          class="form-control mb-2 mr-sm-2"
          id="inlineFormInputName2"
          placeholder="Email Address">

        <button
          type="submit"
          class="btn btn-primary mb-2">
          Let's Go
        </button>
      </form>
      <small> If you've already created picks, we'll look them up.</small>
    </div>

    <div v-if="!loading && makePicks">
      <!--<div class="tier-validation-container">-->
        <!--<div class="tier-validation-cell">-->
          <!--<p>Picks remaining for each tier:</p>-->
        <!--</div>-->
        <!--<div-->
          <!--class="tier-validation-cell"-->
          <!--v-for="tier in tiers"-->
          <!--v-bind:key="tier.name">-->
          <!--{{tier.name}} : {{tier.selected}} / {{tier.required}}-->
        <!--</div>-->
      <!--</div>-->
      <div class="picks-list">
        <div
          v-for="player in players"
          v-bind:key="player.id"
          v-bind:class="{picked: player.picked}"
          v-on:click="makePick(thisTournamentId(player))"
          class="pick-cell">
          {{player.first_name}} {{player.last_name}} {{player.odds}} {{player.tier}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sha256 } from '../common/security';
import { PicksService } from '../common/picks';

export default {
  name: 'PicksComponent',
  data() {
    return {
      email: '',
      loading: false,
      selectEmail: true,
      makePicks: false,
      picks_per_tier: {},
      players: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    thisTournamentId(golfer){
      switch(this.activeTournament.title){
        case 'Masters': return golfer.masters_id;
        default: return golfer.masters_id;
      }
    },
    async fetchData() {
      this.loading = true;
      const data = await PicksService.load();
      this.activeTournament = data.activeTournament;
      this.players = data.golfers.players;

      const masterIdToFieldEntry = data.tournamentField.field.reduce((acc, val) => {
          acc[val.id] = val;
          return acc;
      }, {});

      this.players = this.players.map(g => {
          const fieldEntry = masterIdToFieldEntry[this.thisTournamentId(g)]
          return {
            ...g,
            odds: fieldEntry.odds,
            tier: fieldEntry.tier
          };
      });

      this.picks_per_tier = data.tournamentField.picks_per_tier;
      this.loading = false;
    },
    makePick(playerId){
      console.log(playerId);
      const playerIndex = this.players.findIndex(p => this.thisTournamentId(p) === playerId);
      if(playerIndex >= 0){
        const newPlayer = {
          ...this.players[playerIndex],
          picked: !this.players[playerIndex].picked
        };

        this.$set(this.players, playerIndex, newPlayer);
      }
    },
    async getIndividualPicks() {
      this.loading = true;
      const pickObject = (await PicksService.getIndividualPicks(this.email)).data;
      this.selectEmail = false;
      this.makePicks = true;
      this.loading = false;

      pickObject.picks.forEach(p => this.makePick(p.id))
    },
  }
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

  .form-label-group {
    text-align: left;
  }

  .form-signin {
    padding-left: 5%;
    padding-right: 5%;
  }

  .tier-validation-container {
    display: flex;
    justify-content: space-around;
    background-color: #333333;
    color: white;
  }

  .picked {
    background-color: lavender;
  }

  /*.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {*/
  /*  background-color: #42b983 !important;*/
  /*}*/
</style>
