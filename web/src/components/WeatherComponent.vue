<template>
  <div class="fixed-top weather-component" v-if="weather">
    <div class="weather-row">
      <div class="weather-item">{{Math.round(weather.temperature)}} °F</div>
      <div class="weather-item"><i :class="iconToFontAwesomeClass(weather.icon)"></i></div>
      <div class="weather-item">
        Wind: {{Math.round(weather.windSpeed)}} mph
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
import { WeatherService } from '../common/weather';

const REFRESH_INTERVAL = 30000;

export default {
  name: 'WeatherComponent.vue',
  data: () => ({
    weather: null,
    interval: null,
  }),
  methods: {
    async fetchData() {
      this.weather = await WeatherService.getWeather();
      this.interval = setInterval(() => this.fetchData(), REFRESH_INTERVAL);
    },
    iconToFontAwesomeClass: WeatherService.iconToFontAwesomeClass
  },
  async created() {
    await this.fetchData();
  },
  async beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
.weather-component{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: .8rem;
  background-color: white;
}

  .weather-row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .weather-item{
    padding: .25rem;
  }
</style>
