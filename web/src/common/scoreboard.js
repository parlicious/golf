import {ApiService} from './api';

const calculatePoolParticipantScore = (poolParticipant, playerMap) => {
  const score = poolParticipant.picks.reduce((acc, val) => {
    const player = playerMap[val.id];
    return acc + (player.to_par ? player.to_par : 0);
  }, 0);

  return {
    ...poolParticipant,
    score
  }
};

const transformLeaderboardToPlayerMap = (leaderboard) => {
  return leaderboard.players.reduce((acc, val) => {
    acc[val.id] = val;
    return acc;
  }, {});
};

const scoreAndRankPoolParticipants = (poolParticipants, leaderboard) => {
  return poolParticipants
    .map(p => calculatePoolParticipantScore(p, leaderboard))
    .sort((p1, p2) => p1.score - p2.score);
};

export const ScoreboardService = {

  players: {},
  poolParticipants: [],

  async load() {
    const tournaments = (await ApiService.getTournaments()).data;
    const activeTournament = tournaments.find(x => x.active);
    const picks = (await ApiService.get(activeTournament.picks)).data;
    const leaderboard = (await ApiService.get(activeTournament.leaderboard)).data;
    this.players = transformLeaderboardToPlayerMap(leaderboard);
    this.poolParticipants = scoreAndRankPoolParticipants(picks.pool_participants, this.players);

    return {
      players: this.players,
      poolParticipants: this.poolParticipants
    };
  },
};

export default ScoreboardService;
