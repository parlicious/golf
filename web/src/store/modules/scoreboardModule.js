/* eslint-disable no-param-reassign */
import {
  addCutLineIndicator,
  leaderboardWithTiers,
  orderedPlayersWithScoreDiff,
  playerIdToPoolParticipants,
  scoreAndRankPoolParticipants,
  ScoreboardService,
  transformLeaderboardToPlayerMap,
} from '../../common/scoreboard';
import { TOURNAMENT_REFRESH_INTERVAL } from '../../common/config';

export default {
  state: {
    leaderboard: null,
    picks: null,
    tournamentInfo: null,
    tournamentInterval: null,
  },
  mutations: {
    setLeaderboard(state, payload) {
      const newLeaderboard = payload.leaderboard;
      if (state.leaderboard) {
        const oldPlayers = transformLeaderboardToPlayerMap(state.leaderboard);
        newLeaderboard.players = orderedPlayersWithScoreDiff(
          oldPlayers, newLeaderboard.players,
        );
      }
      if (state.tournamentInfo) {
        state.leaderboard = leaderboardWithTiers(newLeaderboard, state.tournamentInfo);
      } else {
        state.leaderboard = newLeaderboard;
      }
    },
    setPicks(state, payload) {
      state.picks = payload.picks;
    },
    setTournamentInfo(state, payload) {
      state.tournamentInfo = payload.tournamentInfo;
    },
    setTournamentInterval(state, payload) {
      state.tournamentInterval = payload.id;
    },
  },
  getters: {
    getCutLine({ leaderboard }) {
      if (leaderboard) {
        return leaderboard.cut_line;
      }
      return '';
    },
    getPlayers({ leaderboard }) {
      if (leaderboard) {
        return transformLeaderboardToPlayerMap(leaderboard);
      }
      return null;
    },
    getPlayersToPoolParticipants(state, { getPoolParticipants }) {
      return playerIdToPoolParticipants(getPoolParticipants);
    },
    getPoolParticipants(state, { getPlayers }) {
      if (state.picks) {
        return scoreAndRankPoolParticipants(state.picks.pool_participants, getPlayers);
      }
      return [];
    },
    getPoolParticipantsWithFullPicks(state, { getPoolParticipants, getPlayers }) {
      return getPoolParticipants
        .map((p) => {
          const participant = p;
          participant.picks = participant.picks
            .map(pick => getPlayers[pick.tournament_id])
            .filter(x => x);
          return participant;
        });
    },
    getOrderedPlayers({ leaderboard }, { getCutLine }) {
      if (leaderboard) {
        return addCutLineIndicator(getCutLine, leaderboard.players);
      }
      return [];
    },
  },
  actions: {
    async getLeaderboard({ commit }) {
      commit({
        type: 'setLeaderboard',
        leaderboard: await ScoreboardService.getLeaderboard(),
      });
    },
    async getPicks({ commit }) {
      commit({
        type: 'setPicks',
        picks: await ScoreboardService.getPicks(),
      });
    },
    async getTournamentInfo({ commit }) {
      commit({
        type: 'setTournamentInfo',
        tournamentInfo: await ScoreboardService.getTournamentInfo(),
      });
    },
    async loadTournament({ dispatch }) {
      await dispatch('getTournamentInfo');
      await dispatch('getLeaderboard');
      await dispatch('getPicks');
    },
    async initTournament({ commit, dispatch, state }) {
      if (!state.tournamentInterval) {
        await dispatch('loadTournament');
        commit({
          type: 'setTournamentInterval',
          id: setInterval(() => dispatch('loadTournament'), TOURNAMENT_REFRESH_INTERVAL),
        });
      }
    },
  },
};
