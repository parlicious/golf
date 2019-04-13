import * as _ from 'lodash';
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

      const preAdjustmentTotal = accTotal + parseInt(player.to_par ? player.to_par : 0, 10);
      const newToday = accToday + parseInt(player.today ? player.today : 0, 10);
      const penalty = player.individual_pen ? player.individual_pen : 0;
      const bonus = player.individual_bonus ? -1 * player.individual_bonus : 0;
      const newTotal = preAdjustmentTotal + penalty + bonus;

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
    // newPlayers[k].score_diff = oldPlayer.to_par - newPlayers[k].to_par;
    if (newPlayers[k].thru === oldPlayer.thru) {
      newPlayers[k].score_diff = oldPlayer.score_diff;
    } else {
      newPlayers[k].score_diff = oldPlayer.to_par - newPlayers[k].to_par;
    }

    if (!newPlayers[k].score_diff) {
      newPlayers[k].score_diff = 0;
    }
  });

  return newPlayers;
};

const orderedPlayersWithScoreDiff = (oldPlayers, newPlayers) => newPlayers.map((p) => {
  const oldPlayer = oldPlayers[p.id];
  if (p.thru === oldPlayer.thru) {
    p.score_diff = oldPlayer.score_diff;
  } else {
    p.score_diff = oldPlayer.score - p.score;
  }

  if (!p.score_diff) {
    p.score_diff = 0;
  }

  return p;
});

const leaderboardWithTiers = (leaderboard, tournamentInfo) => {
  const newPlayers = leaderboard.players.map((p) => {
    const fieldEntry = tournamentInfo.field.find(q => q.tournament_id === p.id);
    if (fieldEntry) {
      return {
        ...p,
        tier: fieldEntry.tier,
      };
    }

    return p;
  });

  return {
    ...leaderboard,
    players: newPlayers,
  };
};

const addCutLineIndicator = (cutLine, orderedPlayers) => {
  if (cutLine) {
    const cutIndex = orderedPlayers.findIndex(p => p.to_par > parseInt(cutLine));
    if (cutIndex > 0) {
      orderedPlayers[cutIndex].firstCut = true;
    }
  } else {
    const cutIndex = orderedPlayers.findIndex(p => p.status === 'C');
    if (cutIndex > 0) {
      orderedPlayers[cutIndex].firstCut = true;
    }
  }

  return orderedPlayers;
};


export const ScoreboardService = {

  players: null,
  picks: null,
  picks_per_tier: null,
  tournament: null,
  orderedPlayers: [],
  poolParticipants: [],
  tournaments: null,
  activeTournament: null,
  generateBestPicks() {

  },
  async load() {
    this.tournaments = this.tournaments || (await ApiService.getTournaments()).data;
    this.activeTournament = this.activeTournament || this.tournaments.find(x => x.active);
    this.tournamentField = (await ApiService.getUnbusted(this.activeTournament.field)).data;
    this.picks = this.picks || (await ApiService.get(this.activeTournament.picks)).data;
    const leaderboard = leaderboardWithTiers((await ApiService.get(this.activeTournament.leaderboard)).data, this.tournamentField);

    if (this.players) {
      this.players = playersWithScoreDiff(this.players, transformLeaderboardToPlayerMap(leaderboard));
    } else {
      this.players = transformLeaderboardToPlayerMap(leaderboard);
    }
    this.orderedPlayers = addCutLineIndicator(leaderboard.cut_line, orderedPlayersWithScoreDiff(this.players, leaderboard.players));
    this.poolParticipants = scoreAndRankPoolParticipants(this.picks.pool_participants, this.players);

    playerIdToPoolParticipants(this.poolParticipants);

    return {
      cutLine: leaderboard.cut_line,
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
