import * as _ from 'lodash';
import { ApiService } from './api';

const calculatePoolParticipantScores = (poolParticipant, playerMap) => {
  const [total, today] = poolParticipant.picks.reduce(([accTotal, accToday], val) => {
    const player = playerMap[val.tournament_id];
    if (player) {
      if (player.to_par === 'E') {
        player.to_par = 0;
      }

      if (player.today === 'E' || !parseInt(player.today, 10)) {
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

export const transformLeaderboardToPlayerMap = leaderboard => leaderboard.players.reduce(
  (acc, val) => {
    acc[val.id] = val;
    return acc;
  }, {},
);

export const playerIdToPoolParticipants = poolParticipants => _.flatMap(poolParticipants,
  p => p.picks.map(pick => [pick.tournament_id, p.name]))
  .reduce((acc, val) => {
    if (Object.prototype.hasOwnProperty.call(acc, val[0])) {
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
  const newPlayer = p;
  const oldPlayer = oldPlayers[p.id];

  if (!oldPlayer) {
    return newPlayer;
  }

  if (p.thru === oldPlayer.thru) {
    newPlayer.score_diff = oldPlayer.score_diff;
  } else {
    newPlayer.score_diff = oldPlayer.to_par - p.to_par;
  }

  if (!newPlayer.score_diff) {
    newPlayer.score_diff = 0;
  }

  return newPlayer;
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
  const newOrderedPlayers = orderedPlayers;
  if (cutLine) {
    const cutIndex = orderedPlayers.findIndex(p => p.to_par > window.parseInt(cutLine));
    if (cutIndex > 0) {
      newOrderedPlayers[cutIndex].firstCut = true;
    }
  } else {
    const cutIndex = orderedPlayers.findIndex(p => p.status === 'C');
    if (cutIndex > 0) {
      newOrderedPlayers[cutIndex].firstCut = true;
    }
  }

  return newOrderedPlayers;
};


export const ScoreboardService = {
  async getTournaments() {
    return (await ApiService.getTournaments()).data;
  },
  async getLeaderboard(tournament) {
    return (await ApiService.getBusted(tournament.leaderboard)).data;
  },
  async getPicks(tournament) {
    return (await ApiService.get(tournament.picks)).data;
  },
  async hardRefreshPicks(tournament) {
    return (await ApiService.getBusted(tournament.picks)).data;
  },
  async getTournamentInfo(tournament) {
    return (await ApiService.get(tournament.field)).data;
  },
};

export default ScoreboardService;
