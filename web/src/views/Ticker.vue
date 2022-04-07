<template>
  <div id="roster-carousel" ref="test">
    <banner v-bind:num-children="poolParticipants.length" placement="bottom">
      <div class="ticker-item" v-bind:key="participant.name"
           v-for="(participant, index) in poolParticipants">
        <div class="ticker-element" id="name-and-thru">
          {{ participant.name }}
          <small>({{ getTotalThru(participant) }} remaining)</small>
        </div>
        <div class="ticker-element">
          Place {{ index + 1 }}
        </div>
        <div class="ticker-element">
          Total {{ participant.total }}
        </div>
        <div class="ticker-element">
          Today {{ participant.today }}
        </div>
        <div>Penalty {{ getTotalPenalty(participant) }}</div>
      </div>
    </banner>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import Banner from '@/components/BannerComponent.vue';
import {DisplayUtils} from '@/common/displayUtils';

export default {
  name: 'Ticker.vue',
  components: {
    banner: Banner,
  },
  data() {
    return {
      activeParticipants: [],
      currentIndex: 0,
      animationTrigger: 0,
      hasListener: true,
      ...DisplayUtils,
    };
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
  async created() {
    await this.$store.dispatch('initTournament');
  },
};
</script>

<style>
.ticker-item {
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 0.5em;
  border: 2px white;
  border-style: none none none solid;
  position: relative;
}

.ticker-element {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#name-and-thru {
  display: flex;
  flex-direction: column;
  flex-basis: 25rem;
}

#name-and-thru small {
  white-space: nowrap;
}
</style>
