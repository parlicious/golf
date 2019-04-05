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
      <p>Picks remaining for each tier</p>
      <div class="tier-validation-container">
        <div
          class="tier-validation-cell"
          v-for="tier in tiers"
          v-bind:key="tier.name">
          {{tier.name}} : {{tier.selected}} / {{tier.required}}
        </div>
      </div>
      <div class="picks-list">
        <div
          v-for="player in tournamentField.field"
          v-bind:key="player.id"
          class="pick-cell">
          {{player.id}} {{player.odds}} {{player.tier}} {{playerPicked(player)}}
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
      picks: null,
      tiers: [

        {
          name: 'A',
          required: 1,
          selected: 0,
        },
        {
          name: 'B',
          required: 2,
          selected: 0,
        },
        {
          name: 'C',
          required: 3,
          selected: 0,
        },
        {
          name: 'D',
          required: 4,
          selected: 0,
        },
      ],
      golfers: [],
      tournamentField: {},
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    playerPicked(player) {
      if (this.picks && this.picks.picks) {
        return !!this.picks.picks.find(x => x.id === player.id);
      }
      return false;
    },
    async fetchData() {
      this.loading = true;
      const data = await PicksService.load();
      this.golfers = data.golfers;
      this.tournamentField = data.tournamentField;
      this.loading = false;
    },
    async getIndividualPicks() {
      this.loading = true;
      this.picks = (await PicksService.getIndividualPicks(this.email)).data;
      this.selectEmail = false;
      this.makePicks = true;
      this.loading = false;

      this.tiers = Object.keys(this.tournamentField.picks_per_tier)
        .map(l => (
          { name: l, required: this.tournamentField.picks_per_tier[l], selected: 0 }));

      this.picks.picks.forEach((p) => {
        this.tiers.find(t => t.name === p.tier).selected += 1;
      });
    },
  },
  asyncComputed: {
    async msg() {
      return sha256('hello world');
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
  }

  /*.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {*/
  /*  background-color: #42b983 !important;*/
  /*}*/
</style>
