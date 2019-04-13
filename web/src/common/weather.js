import { ApiService } from './api';
import { ScoreboardService } from './scoreboard';

export const WeatherService = {
  async getWeather() {
    const activeTournament = await ScoreboardService.getActiveTournament();
    const weather = await ApiService.getWeather(activeTournament.title, activeTournament.year);
    return weather.data;
  },

  iconToFontAwesomeClass(icon) {
    return {
      'clear-day': 'fas fa-sun',
      'clear-night': 'fas fa-moon',
      rain: 'fas fa-cloud-rain',
      snow: 'fas fa-snowflake',
      sleet: 'fas fa-cloud-showers-heavy',
      wind: 'fas fa-wind',
      fog: 'fas fa-smog',
      cloudy: 'fas fa-cloud',
      'partly-cloudy-day': 'fas fa-cloud-sun',
      'partly-cloudy-night': 'fas fa-cloud-moon',
    }[icon];
  },
};

export default WeatherService;
