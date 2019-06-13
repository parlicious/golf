<template>
  <div>
    <h1 v-if="!displayType"> Select a tournament below </h1>
    <div class="tournaments-history-row">
      <div
        class="tournament-history-item"
        v-for="tournament in tournaments.filter(t => !t.active)"
        v-bind:key="tournament.id">
        <span class="tournament-name">{{tournament.tournament_name}}</span>
        <a v-on:click="selectTournament(tournament, 'standings')">
          Standings
        </a>
        <a v-on:click="selectTournament(tournament, 'leaderboard')">
          Leaderboard
        </a>
      </div>
    </div>
    <StandingsComponent v-if="displayType === 'standings'"/>
    <LeaderboardComponent v-if="displayType === 'leaderboard'"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import StandingsComponent from './StandingsComponent.vue';
import LeaderboardComponent from './LeaderboardComponent.vue';

export default {
  name: 'HistoryComponent',
  components: {
    StandingsComponent,
    LeaderboardComponent,
  },
  computed: mapGetters({
    tournaments: 'getTournaments',
  }),
  data() {
    return {
      selectedTournament: undefined,
      displayType: undefined,
    };
  },
  async created() {
    await this.$store.dispatch('getTournaments');
    await this.$store.dispatch('clearTournament');
  },
  async destroyed() {
    await this.$store.dispatch('clearTournament');
  },
  methods: {
    async selectTournament(tournament, displayType) {
      this.selectedTournament = tournament;
      this.displayType = displayType;
      await this.$store.dispatch('clearTournament');
      await this.$store.dispatch('initTournament', { tournament });
    },
  },
};
</script>

<style scoped>
  .tournaments-history-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: .25rem;
  }

  .tournament-name{
    font-weight: bold;
  }

  .tournament-history-item{
    margin: auto;
    display: flex;
    flex-direction: column;
  }
</style>
