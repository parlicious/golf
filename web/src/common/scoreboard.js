import { ApiService } from './api';

const calculatePoolParticipantScores = (poolParticipant, playerMap) => {
  const [total, today] = poolParticipant.picks.reduce(([accTotal, accToday], val) => {
    const player = playerMap[val.id];
    const newTotal = accTotal + parseInt(player.to_par ? player.to_par : 0, 10);
    const newToday = accToday + parseInt(player.today ? player.today : 0, 10);
    return [newTotal, newToday];
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
      poolParticipants: this.poolParticipants,
    };
  },
};

export default ScoreboardService;
