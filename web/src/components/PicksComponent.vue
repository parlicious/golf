<template>
  <div class="hello">
    <div
      v-if="showErrorMessage"
      class="alert alert-danger" role="alert">
      {{errorMessage}}
    </div>

    <div
      v-if="showSuccessMessage"
      class="alert alert-success" role="alert">
      {{successMessage}}
    </div>

    <div
      v-if="showInfoMessage"
      class="alert alert-info" role="alert">
      {{infoMessage}}
    </div>

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
      <div class="tier-validation-container">
        <div class="tier-validation-cell">
          <p>Picks remaining for each tier:</p>
        </div>
        <div
          class="tier-validation-cell"
          v-for="tier in tierView().view"
          v-bind:key="tier.name">
          {{tier.name}} : <span>{{tier.selected}} / {{tier.required}}</span>
        </div>
        <div
          class="tier-validation-cell">
          Valid: {{tierView().valid}}
        </div>
      </div>
      <form
        @submit.prevent="submitPicks"
        class="form-signin form-inline justify-content-center">
        <label class="sr-only" for="editKeyInput">Edit Key</label>
        <input
          v-model="editKey"
          type="text"
          class="form-control mb-2 mr-sm-2"
          id="editKeyInput"
          placeholder="Picks Password">

        <button
          type="submit"
          class="btn btn-primary mb-2">
          Submit Picks
        </button>
      </form>
      <div class="picks-list">
        <div
          v-for="player in players"
          v-bind:key="player.id"
          v-bind:class="{picked: player.picked}"
          v-on:click="makePick(player.tournament_id)"
          class="pick-cell">
          {{player.first_name}} {{player.last_name}} {{player.fractional_odds}} {{player.tier}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PicksService } from '../common/picks';

const timeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default {
  name: 'PicksComponent',
  data() {
    return {
      email: '',
      editKey: '',
      showErrorMessage: false,
      errorMessage: null,
      showInfoMessage: false,
      infoMessage: null,
      showSuccessMessage: false,
      successMessage: null,
      loading: false,
      selectEmail: true,
      editing: false,
      makePicks: false,
      picks_per_tier: {},
      players: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const data = await PicksService.load();
      this.players = data.tournamentField.field;
      this.picks_per_tier = data.tournamentField.picks_per_tier;
      this.loading = false;
    },
    async displayInfo(message){
      this.infoMessage = message;
      this.showInfoMessage = true;
      await timeout(2000);
      this.showInfoMessage = false;
    },
    async displayError(message){
      this.errorMessage = message;
      this.showErrorMessage = true;
      await timeout(2000);
      this.showErrorMessage = false;
    },
    async displaySuccess(message){
      this.successMessage = message;
      this.showSuccessMessage = true;
      await timeout(2000);
      this.showSuccessMessage = false;
    },
    makePick(playerId) {
      const playerIndex = this.players.findIndex(p => p.tournament_id === playerId);
      if (playerIndex >= 0) {
        const newPlayer = {
          ...this.players[playerIndex],
          picked: !this.players[playerIndex].picked,
        };

        this.$set(this.players, playerIndex, newPlayer);
      }
    },
    async getIndividualPicks() {
      this.loading = true;
      try {
        const pickObject = (await PicksService.getIndividualPicks(this.email)).data;
        pickObject.picks.forEach(p => this.makePick(p.tournament_id));
        this.editing = true;
        this.displayInfo('Loaded picks!')
      } catch {
        // new picks
        this.editing = false;
      }

      this.selectEmail = false;
      this.makePicks = true;
      this.loading = false;

    },
    async submitPicks() {
      const picks = this.players.filter(p => p.picked);
      try{
        await PicksService.submitPicks(picks, this.email, '', this.editKey);
        this.displaySuccess('Picks Saved!')
      } catch(e){
        console.log(e);
        this.displayError('Error saving picks');
      }
    },
    tierView() {
      const tier = this.picks_per_tier;
      const view = Object.keys(tier).map(k => ({ name: k, selected: 0, required: tier[k] }));
      const mapping = Object.keys(tier).reduce(([acc, idx], val) => {
        acc[val] = idx;
        const newIdx = idx + 1;
        return [acc, newIdx];
      }, [{}, 0])[0];

      this.players.forEach((p) => {
        if (p.picked) {
          view[mapping[p.tier]].selected += 1;
        }
      });

      const valid = view.filter(t => t.selected !== t.required).length === 0;

      return {
        view,
        valid,
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /**, *:before, *:after {*/
  /*  -webkit-user-select: none; !* Chrome/Safari *!*/
  /*  -moz-user-select: none; !* Firefox *!*/
  /*  -ms-user-select: none; !* IE10+ *!*/
  /*}*/

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
