<template>
  <div class="fixed-top weather-component" v-if="weather">
      <div class="location-row">
        {{activeTournament.location}}
      </div>
      <div class="weather-row">
        <div class="weather-item">{{Math.round(weather.temperature)}} °F</div>
        <div class="weather-item"><i :class="iconToFontAwesomeClass(weather.icon)"></i></div>
        <div class="weather-item">
          Wind: {{Math.round(weather.windSpeed)}} ({{Math.round(weather.windGust)}}) mph
        </div>
        <div class="weather-item">
          <i
            :\style="`transform:rotate(${weather.windBearing}deg)`"
            class="fas fa-long-arrow-alt-up">
          </i>
        </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {WeatherService} from '../common/weather';

  export default {
    name: 'WeatherComponent.vue',
    computed: mapGetters({
      weather: 'getWeather',
      activeTournament: 'activeTournament',
    }),
    methods: {
      iconToFontAwesomeClass: WeatherService.iconToFontAwesomeClass,
    },
    async created() {
      await this.$store.dispatch('initWeather');
    },
  };
</script>

<style scoped>
  .weather-component {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: .8rem;
    background-color: var(--background);
  }

  .location-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .weather-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .weather-item {
    padding: .25rem;
  }
</style>
