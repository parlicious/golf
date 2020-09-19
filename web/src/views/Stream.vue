<template>
  <div id="player" ref="player">
    <iframe
      src="https://player.twitch.tv/?channel=lizzastreaming&parent=localhost"
      :height="height"
      :width="width"
      frameborder="0"
      scrolling="no"
      allowfullscreen="true">
    </iframe>
    <div class="participant-select">
     Select a participant to show their roster
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
import PoolParticipantComponent from "../components/PoolParticipantComponent";
import {DisplayUtils} from "../common/displayUtils";

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
    };
  },
  async created() {
    await this.$store.dispatch('initTournament');
  },
  methods: {
    ...DisplayUtils,
    matchHeight() {
      if (this.$refs.player) {
        this.height = this.$refs.player.clientHeight;
        this.width = this.$refs.player.clientWidth;
      }
    },
  },
  mounted() {
    this.matchHeight();
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

  .participant-select{
    display: flex;
    justify-content: space-between;
  }

  #player {
    width: 100%;
    margin: auto;
  }

  #dummy {
    width: 100%;
    margin: auto;
    padding-top: calc(591.44 / 1127.34 * 100%);
  }
</style>
