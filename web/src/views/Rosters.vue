<template>
  <div id="roster-carousel" ref="test">
    <div class="animate a" v-if="activeParticipants[0]" ref='a' :key="animationTrigger">
      <table class="table" v-bind:class="{condensed: true}">
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
          v-bind:key="activeParticipants[0].name"
          v-bind:showPlayers="true"
          v-bind:cutLine="cutLine"
          v-bind:timezone="timezone"
          v-bind:participant="activeParticipants[0]">
        </pool-participant>
      </table>
    </div>
    <div class="animate b" v-if="activeParticipants[1]" :key="animationTrigger + 1">
      <table class="table" v-bind:class="{condensed: true}">
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
          v-bind:key="activeParticipants[1].name"
          v-bind:showPlayers="true"
          v-bind:cutLine="cutLine"
          v-bind:timezone="timezone"
          v-bind:participant="activeParticipants[1]">
        </pool-participant>
      </table>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import PoolParticipantComponent from '../components/PoolParticipantComponent.vue';

export default {
  name: 'Rosters.vue',
  components: {
    'pool-participant': PoolParticipantComponent,
  },
  data() {
    return {
      activeParticipants: [],
      currentIndex: 0,
      animationTrigger: 0,
      hasListener: true,
    };
  },
  methods: {
    rotateParticipants() {
      if (this.hasListener) {
        this.activeParticipants = [
          this.poolParticipants[this.currentIndex],
          this.poolParticipants[(this.currentIndex + 1) % this.poolParticipants.length],
        ];
        this.currentIndex = (this.currentIndex + 1) % this.poolParticipants.length;
      }
      this.hasListener = !this.hasListener;
    },
  },
  async mounted() {
    await this.$store.dispatch('initTournament');
    this.rotateParticipants();
  },
  updated() {
    if (this.$refs.a) {
      console.log(this.activeParticipants.map(p => p.name));
      this.$refs.a.addEventListener('animationend', () => {
        this.animationTrigger = this.animationTrigger + 1;
        this.rotateParticipants();
      });
    }
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

<style scoped>
  .animate {
    animation: translate 15s ease-in-out;
    margin: 60px;
    width: 400px;
  }

  #roster-carousel {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 460px;
    margin: auto;
  }

  @keyframes translate {

    0% {
      transform: translate(0, 0);
    }
    95% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-460px, 0);
    }
  }

</style>
