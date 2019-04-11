import {ApiService} from './api';
import * as _ from 'lodash';

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

const playerIdToPoolParticipants = poolParticipants => _.flatMap(poolParticipants,
  p => p.picks.map(pick => [pick.tournament_id, p.name]))
  .reduce((acc, val) => {
    if (acc.hasOwnProperty(val[0])) {
      acc[val[0]] = [...acc[val[0]], val[1]];
    } else {
      acc[val[0]] = [val[1]];
    }

    return acc;
  }, {});

const scoreAndRankPoolParticipants = (poolParticipants, leaderboard) => poolParticipants
  .map(p => calculatePoolParticipantScores(p, leaderboard))
  .sort((p1, p2) => p1.total - p2.total);

const playersWithScoreDiff = (oldPlayers, newPlayers) => {
  Object.keys(oldPlayers).forEach((k) => {
    const oldPlayer = oldPlayers[k];
    newPlayers[k].score_diff = oldPlayer.to_par - newPlayers[k].to_par;
    // if (newPlayers.thru === oldPlayer.thru) {
    //   newPlayers[k].score_diff = oldPlayer.score_diff;
    // } else {
    //   newPlayers[k].score_diff = oldPlayer.to_par - newPlayers[k].to_par;
    // }
  });

  return newPlayers;
};

const orderedPlayersWithScoreDiff = (oldPlayers, newPlayers) => newPlayers.map((p) => {
  const oldPlayer = oldPlayers[p.id];
  // if (newPlayers.thru === oldPlayer.thru) {
  //   p.score_diff = oldPlayer.score_diff;
  // } else {
  //   p.score_diff = oldPlayer.score - p.score;
  // }
  p.score_diff = oldPlayer.score - p.score;

  return p;
});


export const ScoreboardService = {

  players: null,
  picks: null,
  orderedPlayers: [],
  poolParticipants: [],
  tournaments: null,
  activeTournament: null,
  async load() {
    this.tournaments = this.tournaments || (await ApiService.getTournaments()).data;
    this.activeTournament = this.activeTournament || this.tournaments.find(x => x.active);
    this.picks = this.picks || (await ApiService.get(this.activeTournament.picks)).data;
    const leaderboard = (await ApiService.get(this.activeTournament.leaderboard)).data;
    if (this.players) {
      this.players = playersWithScoreDiff(this.players, transformLeaderboardToPlayerMap(leaderboard));
    } else {
      this.players = transformLeaderboardToPlayerMap(leaderboard);
    }
    this.orderedPlayers = orderedPlayersWithScoreDiff(this.players, leaderboard.players);
    this.poolParticipants = scoreAndRankPoolParticipants(this.picks.pool_participants, this.players);

    playerIdToPoolParticipants(this.poolParticipants);

    return {
      players: this.players,
      playersToPoolParticipants: playerIdToPoolParticipants(this.poolParticipants),
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
