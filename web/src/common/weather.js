import { ApiService } from './api';
import { ScoreboardService } from './scoreboard';

export const WeatherService = {
  async getWeather(title, year) {
    const weather = await ApiService.getWeather(title, year);
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
