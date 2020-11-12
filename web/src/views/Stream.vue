<template>
  <div id="player" ref="player" v-bind:class="{full: isFull}">
    <div id="exit-fullscreen" v-if="isFull" v-on:click="exitFullscreen()">
      Exit fullscreen
    </div>
    <iframe
      :src="srcUrl"
      :height="height"
      :width="width"
      frameborder="0"
      scrolling="no"
      allowfullscreen="true">
    </iframe>
    <div class="participant-select">
      Select a participant to show their roster
      <div v-on:click="windowedFullscreen()">
        Fill Window with Stream
      </div>
      <select v-model="selected">
        <option disabled value="">Select a person to show roster</option>
        <option v-for="option in poolParticipants" v-bind:value="option.name">
          {{ option.name }}
        </option>
      </select>
    </div>
    <div v-if="selected !== null" id="participantOverlay">
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
          v-bind:key="getParticipantByName(poolParticipants, selected).name"
          v-bind:showPlayers="true"
          v-bind:cutLine="cutLine"
          v-bind:timezone="timezone"
          v-bind:participant="getParticipantByName(poolParticipants, selected)">
        </pool-participant>
      </table>
    </div>
    <div id="dummy"/>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import PoolParticipantComponent from '../components/PoolParticipantComponent';
import { DisplayUtils } from '../common/displayUtils';

export default {
  name: 'Stream.vue',
  components: {
    'pool-participant': PoolParticipantComponent,
  },
  data() {
    return {
      height: 0,
      width: 0,
      selected: null,
      srcUrl: '',
      isFull: false,
    };
  },
  async created() {
    await this.$store.dispatch('initTournament');
  },
  methods: {
    ...DisplayUtils,
    matchHeight() {
      if (this.$refs.player) {
        if (this.isFull) {
          this.windowedFullscreen();
        } else {
          this.height = (591.44 / 1127.34) * this.$refs.player.clientWidth;
          this.width = this.$refs.player.clientWidth;
        }
      }
    },
    windowedFullscreen() {
      this.height = window.innerHeight;
      this.width = window.innerWidth;
      this.isFull = true;
    },
    exitFullscreen() {
      this.isFull = false;
      this.matchHeight();
    }
  },
  mounted() {
    this.matchHeight();
    this.srcUrl = `https://player.twitch.tv/?channel=lizzastreaming&parent=${window.location.hostname}`;
    window.addEventListener('resize', this.matchHeight);
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

  /*#participantOverlay {*/
  /*  position: absolute;*/
  /*  top: 0*/
  /*}*/

  #exit-fullscreen {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100000;
    color: #cccccc;
  }

  .participant-select {
    display: flex;
    justify-content: space-between;
  }

  #player {
    position: absolute;
    width: 85vw;
    left: calc(15vw / 2);
  }

  .full {
    left: 0 !important;
    top: 0 !important;
  }

  #dummy {
    width: 100%;
    margin: auto;
    padding-top: calc(591.44 / 1127.34 * 100%);
  }
</style>
