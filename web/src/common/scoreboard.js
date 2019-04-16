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
      const bonus = player.individual_bonus ? player.individual_bonus : 0;
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

export const transformLeaderboardToPlayerMap = leaderboard => leaderboard.players.reduce((acc, val) => {
  acc[val.id] = val;
  return acc;
}, {});

export const playerIdToPoolParticipants = poolParticipants => _.flatMap(poolParticipants,
  p => p.picks.map(pick => [pick.tournament_id, p.name]))
  .reduce((acc, val) => {
    if (acc.hasOwnProperty(val[0])) {
      acc[val[0]] = [...acc[val[0]], val[1]];
    } else {
      acc[val[0]] = [val[1]];
    }

    return acc;
  }, {});

export const scoreAndRankPoolParticipants = (poolParticipants, leaderboard) => poolParticipants
  .map(p => calculatePoolParticipantScores(p, leaderboard))
  .sort((p1, p2) => p1.total - p2.total);

export const orderedPlayersWithScoreDiff = (oldPlayers, newPlayers) => newPlayers.map((p) => {
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

export const leaderboardWithTiers = (leaderboard, tournamentInfo) => {
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

export const addCutLineIndicator = (cutLine, orderedPlayers) => {
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
  tournaments: null,
  activeTournament: null,

  async getActiveTournament() {
    this.tournaments = this.tournaments || (await ApiService.getTournaments()).data;
    return this.activeTournament || this.tournaments.find(x => x.active);
  },
  async getLeaderboard() {
    this.tournaments = this.tournaments || (await ApiService.getTournaments()).data;
    this.activeTournament = this.activeTournament || this.tournaments.find(x => x.active);
    return (await ApiService.get(this.activeTournament.leaderboard)).data;
  },
  async getPicks() {
    this.tournaments = this.tournaments || (await ApiService.getTournaments()).data;
    this.activeTournament = this.activeTournament || this.tournaments.find(x => x.active);
    return (await ApiService.getUnbusted(this.activeTournament.picks)).data;
  },
  async getTournamentInfo() {
    this.tournaments = this.tournaments || (await ApiService.getTournaments()).data;
    this.activeTournament = this.activeTournament || this.tournaments.find(x => x.active);
    return (await ApiService.getUnbusted(this.activeTournament.field)).data;
  },
};

export default ScoreboardService;
