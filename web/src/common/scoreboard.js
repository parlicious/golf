import * as _ from 'lodash';
import {ApiService} from './api';
import {DisplayUtils} from '@/common/displayUtils';


// const playerIsLeader = (player, leaderboard)

const determinePenalty = (player, leaderboard, simulationOptions) => {
  const cutLine = parseInt(leaderboard.cut_line);
  if (simulationOptions.simulateCutPenalty && DisplayUtils.displayPlayerCut(simulationOptions.cutPenaltyAmount, player)) {
    return 2 * leaderboard.cut_penalty;
  }
  if (simulationOptions.simulateCutPenalty && player.position === '1') {
    return -2 * leaderboard.cut_penalty;
  }
  return player.individual_pen ? player.individual_pen : 0;
};

const getCompletedHoles = (pick) => {
  if (pick.status === 'C') {
    return 2 * 18;
  }

  const holesFromPrevRounds = (parseInt(pick.round, 10) - 1) * 18;

  if (pick.thru.includes('F')) {
    return holesFromPrevRounds + 18;
  }

  const normalizedThru = pick && pick.thru && pick.thru.replace && pick.thru.replace('*', '').trim();
  if (isNaN(normalizedThru)) {
    return holesFromPrevRounds;
  }

  return parseInt(normalizedThru, 10) + holesFromPrevRounds;
};

const getAverageScorePerHole = (participant, playerMap) => {
  return _.sum(participant.picks.map((p) => {
    const pick = playerMap[p.tournament_id];
    const completed = getCompletedHoles(pick);
    // const to_par = pick.to_par === 'E' ? 0 : parseInt(pick.to_par, 10);
    // const res = completed === 0 ? 0 : to_par / completed;
    // console.log(pick);
    // console.log(`${pick.first_name} ${pick.last_name} is ${to_par} through ${completed} (${res})`);
    return completed;
  }));
};

const calculatePoolParticipantScores = (poolParticipant, playerMap, simulationOptions = {}) => {
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
      const penalty = determinePenalty(player, playerMap, simulationOptions);
      const bonus = player.individual_bonus ? player.individual_bonus : 0;
      const newTotal = preAdjustmentTotal + penalty + bonus;

      return [newTotal, newToday];
    }
    return [accTotal, accToday];
  }, [0, 0]);

  return {
    ...poolParticipant,
    averageScorePerHole: total / getAverageScorePerHole(poolParticipant, playerMap),
    total,
    today,
  };
};

export const transformLeaderboardToPlayerMap = (leaderboard, simulationOptions = {}) => leaderboard.players.reduce(
  (acc, val) => {
    acc[val.id] = {
      ...val,
      individual_pen: determinePenalty(val, leaderboard, simulationOptions),
    };
    return acc;
  }, {...leaderboard},
);

export const playerIdToPoolParticipants = poolParticipants => _.flatMap(poolParticipants,
  p => p.picks.map(pick => [pick.tournament_id || pick.id, p.name]))
  .reduce((acc, val) => {
    if (Object.prototype.hasOwnProperty.call(acc, val[0])) {
      acc[val[0]] = [...acc[val[0]], val[1]];
    } else {
      acc[val[0]] = [val[1]];
    }

    // console.log(acc, val);

    return acc;
  }, {});

export const scoreAndRankPoolParticipants = (poolParticipants, leaderboard, simulationOptions = {}) => poolParticipants
  .map(p => calculatePoolParticipantScores(p, leaderboard, simulationOptions))
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

export const simulateRemainingScores = (leaderboard) => {
  console.log(leaderboard);
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
