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

    <div v-if="loading">
      <h1> Make Your Picks </h1>
      Loading ...
    </div>

    <div v-if="picksAllowed">
      <div v-if="!loading && selectEmail">
        <h1> Make Your Picks </h1>
        <p> Enter your email to get started</p>
        <form
          @submit.prevent="getIndividualPicks"
          class="form-signin form-inline justify-content-center">
          <label class="sr-only" for="inlineFormInputName2">Email</label>
          <input
            v-model="email"
            type="email"
            class="form-control mb-2 mr-sm-2"
            id="inlineFormInputName2"
            placeholder="Email Address">

          <button
            type="submit"
            class="btn btn-primary mb-2">
            Let's Go
          </button>
        </form>
        <p> Picks close at {{picksEndAtTime()}}</p>
        <small> If you've already created picks, we'll look them up.</small>
      </div>

      <div v-if="!loading && makePicks">
        <h1 v-if="!editing"> Make Your Picks </h1>
        <h1 v-if="editing"> Edit Your Picks </h1>
        <small v-if="!tierView().valid">
          First pick your players for each tier below
        </small>

        <small v-if="tierView().valid">
          Make changes to your players for each tier below
        </small>

        <div class="tiers ">
          <div class="row">
            <div
              class="col mx-0 px-1 my-2 tier"
              v-for="tier in tierView().view"
              v-bind:key="tier.name">
              <div class="card"
                   v-bind:class="{ 'tiers-correct': tier.required === tier.selected }"
              >
                <div class="card-header">{{tier.name}}</div>
                <div class="card-body">
                  <p class="card-text">{{tier.required - tier.selected}} left </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="picks-list mb-5">
          <table class="table">
            <thead>
            <th scope="col">Tier</th>
            <th scope="col">Name</th>
            <th scope="col">Odds</th>
            </thead>
            <tr
              v-for="player in players"
              v-bind:key="player.id"
              v-bind:class="{picked: player.picked}"
              v-on:click="makePick(player.tournament_id)"
              class="pick-cell">
              <td> {{player.tier}}</td>
              <td> {{player.first_name}} {{player.last_name}}</td>
              <td> {{player.fractional_odds}}</td>
            </tr>
          </table>

        </div>

        <div
          v-if="tierView().valid"
          class="confirm-area row justify-content-sm-center pb-4 pl-1 pr-1 fixed-bottom">
          <div class="col-12 col-sm-6">
            <button
              type="button"
              class="btn btn-primary btn-block"
              v-on:click="confirmPicks()"
              :disabled="!tierView().valid">
              Confirm Picks
            </button>
          </div>
        </div>
      </div>

      <div v-if="!loading && confirmingPicks">
        <h1> Confirm Your Picks </h1>
        <small>
          If the picks below look right, enter your name and pick a password to lock
          down your picks. Don't forget it, you'll need it later if you want to edit your
          picks.
        </small>
        <div
          class="row">
          <div class="col  align-self-center">
            <form
              @submit.prevent="submitPicks"
              class="form-signin float-center">
              <div class="form-row">
                <div class="col-12 col-md-3">
                  <label class="sr-only" for="editKeyInput">Edit Key</label>
                  <input
                    v-model="name"

                    type="text"
                    class="form-control  mb-2 "
                    id="nameInput"
                    placeholder="Name">
                </div>
                <div class="col-12 col-md-4">
                  <label class="sr-only" for="editKeyInput">Edit Key</label>
                  <input
                    v-model="email"

                    type="email"
                    class="form-control  mb-2 "
                    id="emailInput"
                    placeholder="Email Address">
                </div>
                <div class="col-12 col-md-3">
                  <label class="sr-only" for="editKeyInput">Edit Key</label>
                  <input
                    v-model="editKey"

                    type="text"
                    class="form-control  mb-2 "
                    id="editKeyInput"
                    placeholder="Picks Password">
                </div>
                <div class="col-12 col-md-2">
                  <button
                    type="submit"
                    class="btn btn-primary mb-2"
                    :disabled="!submitFormValid()">
                    <template v-if="!this.submitting"> Submit Picks </template>
                    <template v-if="this.submitting">
                      <i class="fas fa-spinner fa-spin"></i>
                    </template>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="picks-list">
          <table class="table">
            <thead>
            <th scope="col">Tier</th>
            <th scope="col">Name</th>
            <th scope="col">Odds</th>
            </thead>
            <tr
              v-for="player in players.filter(p => p.picked)"
              v-bind:key="player.id"
              class="pick-cell">
              <td> {{player.tier}}</td>
              <td> {{player.first_name}} {{player.last_name}}</td>
              <td> {{player.fractional_odds}}</td>
            </tr>
          </table>

        </div>

        <div
          class="row">
          <div class="col  align-self-center">
            <button
              v-on:click="changePicks()"
              type="button"
              class="btn btn-primary mb-2">
              Change Picks
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!picksAllowed">
      <p> Picks are no longer being accepted for this tournament, but you can check out the
        <router-link to="/standings">standings</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { PicksService } from '../common/picks';

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  name: 'PicksComponent',
  data() {
    return {
      email: '',
      name: '',
      editKey: '',
      submitting: false,
      showErrorMessage: false,
      errorMessage: null,
      showInfoMessage: false,
      infoMessage: null,
      showSuccessMessage: false,
      successMessage: null,
      loading: false,
      picksAllowed: true,
      selectEmail: true,
      editing: false,
      makePicks: false,
      acceptingPicksUntil: null,
      confirmingPicks: false,
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
      // this.picksAllowed = (Date.parse(data.activeTournament.accepting_picks_until) - Date.now()) > 0;
      this.picksAllowed = true;
      this.acceptingPicksUntil = data.activeTournament.accepting_picks_until;
      this.players = data.tournamentField.field;
      this.picks_per_tier = data.tournamentField.picks_per_tier;
      this.loading = false;
    },
    picksEndAtTime() {
      const date = new Date(Date.parse(this.acceptingPicksUntil));
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString('en-US', {timeZoneName: 'short'})}`;
    },
    async displayInfo(message) {
      this.infoMessage = message;
      this.showInfoMessage = true;
      await timeout(2000);
      this.showInfoMessage = false;
    },
    async displayError(message) {
      this.errorMessage = message;
      this.showErrorMessage = true;
      await timeout(2000);
      this.showErrorMessage = false;
    },
    async displaySuccess(message) {
      this.successMessage = message;
      this.showSuccessMessage = true;
      await timeout(2000);
      this.showSuccessMessage = false;
    },
    scrollToTop() {
      window.scrollTo(0, 0);
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
      if (!this.email) {
        this.displayError('You must enter an email address');
      } else {
        this.loading = true;
        try {
          const pickObject = (await PicksService.getIndividualPicks(this.email)).data;
          pickObject.picks.forEach(p => this.makePick(p.tournament_id));
          this.name = pickObject.name;
          this.editing = true;
        } catch {
          // new picks
          this.editing = false;
        }

        this.selectEmail = false;
        this.makePicks = true;
        this.loading = false;
      }
    },
    confirmPicks() {
      this.makePicks = false;
      this.confirmingPicks = true;
      this.scrollToTop();
    },
    changePicks() {
      this.makePicks = true;
      this.confirmingPicks = false;
      this.scrollToTop();
    },
    submitFormValid() {
      return !!this.email && !!this.name && !!this.editKey;
    },
    async submitPicks() {
      this.submitting = true;
      const picks = this.players.filter(p => p.picked);
      try {
        await PicksService.submitPicks(picks, this.email, this.name, this.editKey);
        await this.$store.dispatch('hardRefreshPicks');
        this.displaySuccess('Picks Saved!');
      } catch (e) {
        console.log(e);
        if (e.response.status === 403) {
          this.displayError('Password for picks was incorrect');
        } else {
          this.displayError('Error saving picks');
        }
      } finally {
        this.submitting = false;
      }
    },
    tierView() {
      const tier = this.picks_per_tier;
      const view = Object.keys(tier)
        .map(k => ({ name: k, selected: 0, required: tier[k] }))
        .filter(t => t.required > 0);
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
  mounted() {
    if (localStorage.email) {
      this.$set(this, 'email', localStorage.email);
    }
  },
  watch: {
    email(newEmail) {
      localStorage.email = newEmail;
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

  div, tr {
    transition: background-color 0.2s ease;
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

  .tiers {
    position: sticky;
    top: 0;
    background: var(--background);
  }

  .tiers .tier .card-header {
    font-size: 1.5rem;
    font-weight: bold;
    padding: .5rem;
  }

  .tiers .tier .card-body {
    padding: .25rem;
  }

  .picks-list {
    margin-top: .5rem;
  }

  .pick-cell {
    cursor: pointer;
  }

  .pick-cell:hover {
    background-color: #eee;
  }

  .form-label-group {
    text-align: left;
  }

  .picked {
    background-color: #42b983 !important;
    color: white;
  }

  .tiers-correct {
    background-color: #42b983;
    color: white;
  }

  #inlineFormInputName2 {
    width: 80%;
  }

  .confirm-area {
    background-color: var(--background);
  }


  /*.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {*/
  /*  background-color: #42b983 !important;*/
  /*}*/
</style>
