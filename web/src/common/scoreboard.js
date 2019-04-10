import { ApiService } from './api';

const calculatePoolParticipantScores = (poolParticipant, playerMap) => {
  const [total, today] = poolParticipant.picks.reduce(([accTotal, accToday], val) => {
    const player = playerMap[val.tournament_id];
    if (player) {
      if (player.to_par === 'E') {
        player.to_par = 0;
      }

      if (player.today === 'E') {
        player.today = 0;
      }

      const newTotal = accTotal + parseInt(player.to_par ? player.to_par : 0, 10);
      const newToday = accToday + parseInt(player.today ? player.today : 0, 10);
      return [newTotal, newToday];
    }
    return [accTotal, accToday];
  }, [0, 0]);

  return {
    ...poolParticipant,
    total,
    today,
  };
};

const transformLeaderboardToPlayerMap = leaderboard => leaderboard.players.reduce((acc, val) => {
  acc[val.id] = val;
  return acc;
}, {});

const scoreAndRankPoolParticipants = (poolParticipants, leaderboard) => poolParticipants
  .map(p => calculatePoolParticipantScores(p, leaderboard))
  .sort((p1, p2) => p1.total - p2.total);

const playersWithScoreDiff = (oldPlayers, newPlayers) => {
  Object.keys(oldPlayers).forEach(k => {
    const oldScore = oldPlayers[k].to_par;
    const newScore = newPlayers[k].to_par;
    newPlayers[k].score_diff = oldScore - newScore;
  });

  return newPlayers;
};

const orderedPlayersWithScoreDiff = (oldPlayers, newPlayers) => {
  return newPlayers.map(p => {
    p.score_diff = oldPlayers[p.id].score - p.score;
    return p;
  });
};

export const ScoreboardService = {

  players: {},
  orderedPlayers: [],
  poolParticipants: [],
  tournaments: [],
  activeTournament: {},
  async load() {
    this.tournaments = (await ApiService.getTournaments()).data;
    this.activeTournament = this.tournaments.find(x => x.active);
    const picks = (await ApiService.get(this.activeTournament.picks)).data;
    const leaderboard = (await ApiService.get(this.activeTournament.leaderboard)).data;
    this.players = transformLeaderboardToPlayerMap(leaderboard);
    this.orderedPlayers = leaderboard.players;
    this.poolParticipants = scoreAndRankPoolParticipants(picks.pool_participants, this.players);

    return {
      players: this.players,
      orderedPlayers: this.orderedPlayers,
      poolParticipants: this.poolParticipants,
    };
  },

  async reload() {
    const picks = (await ApiService.get(this.activeTournament.picks)).data;
    const leaderboard = (await ApiService.get(this.activeTournament.leaderboard)).data;
    this.orderedPlayers = orderedPlayersWithScoreDiff(this.players, leaderboard.players);
    this.players = playersWithScoreDiff(this.players, transformLeaderboardToPlayerMap(leaderboard));
    this.poolParticipants = scoreAndRankPoolParticipants(picks.pool_participants, this.players);

    return {
      players: this.players,
      orderedPlayers: this.orderedPlayers,
      poolParticipants: this.poolParticipants,
    };
  },
};

export default ScoreboardService;
