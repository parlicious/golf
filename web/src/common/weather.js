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

  bearingToDirection(windBearing) {
    // bearing is direction wind is coming from
    const direction = Math.round( windBearing / 45);
    return direction;
    // switch (direction) {
    //   case 0: return 'N';
    //   case 1: return 'NE';
    //   case 2: return 'E';
    //   case 3: return 'SE';
    //   case 4: return 'S';
    //   case 5: return 'SW';
    //   case 6: return 'W';
    //   case 7: return 'NW';
    //   default: return 'N';
    // }
  },
};

export default WeatherService;
