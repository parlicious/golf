import {ApiService} from './api';

const calculatePlayerScore = (playerPicks, leaderboard) => {
  
};

export default {

  golfers: {},
  players: {},

  async load() {
    const tournaments = (await ApiService.getTournaments()).data;
    const activeTournament = tournaments.find(x => x.active);
    const picks = (await ApiService.get(activeTournament.picks)).data;
    const leaderboard = (await ApiService.get(activeTournament.leaderboard)).data;


  },
};
