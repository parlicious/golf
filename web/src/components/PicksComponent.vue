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
      <div class="tiers">
        <div class="row">

          <div
            class="col mx-0 px-1 my-2 tier"
            v-for="tier in tierView().view"
            v-bind:key="tier.name">
              <div class="card"
                v-bind:class="{ 'bg-success': tier.required === tier.selected }"
                >
                <div class="card-header">{{tier.name}}</div>
                <div class="card-body">
                  <p class="card-text">{{tier.required - tier.selected}} left </p>
                </div>
              </div>
          </div>

        </div>
        <div
            class="row">
            <div class="col align-self-end">
              <form
                @submit.prevent="submitPicks"
                class="form-signin form-inline float-right">
                <label class="sr-only" for="editKeyInput">Edit Key</label>
                <input
                  v-model="editKey"
                  type="text"
                  class="form-control mb-2 mr-sm-2"
                  id="editKeyInput"
                  placeholder="Picks Password">

                <button
                  type="submit"
                  class="btn btn-primary mb-2"
                  :disabled="!tierView().valid">
                  Submit Picks
                </button>
              </form>
            </div>
        </div>
      </div>

      <div class="picks-list">
        <table class="table">
          <tr
            v-for="player in players"
            v-bind:key="player.id"
            v-bind:class="{picked: player.picked}"
            v-on:click="makePick(player.tournament_id)"
            class="pick-cell">
            <td> {{player.tier}} </td>
            <td> {{player.first_name}} {{player.last_name}}  </td>
            <td> {{player.fractional_odds}}  </td>
          </tr>
        </table>

      </div>
    </div>
  </div>
</template>

<script>
import { PicksService } from '../common/picks';

export default {
  name: 'PicksComponent',
  data() {
    return {
      email: '',
      editKey: '',
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
      await PicksService.submitPicks(picks, this.email, '', this.editKey);
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

  div, tr {
    transition: background-color 0.5s ease;
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
    position:sticky;
    top:0;
    background:white;
  }

  .tiers .tier .card-header{
    font-size:1.5rem;
    font-weight: bold;

  }

  .picks-list {
    margin-top:2rem;
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
  }

  /*.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {*/
  /*  background-color: #42b983 !important;*/
  /*}*/
</style>
