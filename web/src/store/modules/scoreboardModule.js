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
    tournamentName: null,
    activeTournament: null,
    leaderboard: null,
    picks: null,
    tournaments: [],
    tournamentInfo: null,
    tournamentInterval: null,
    simulationOptions: {
      simulateCutPenalty: false,
      cutPenaltyAmount: null,
      originalCutAmount: null,
    },
  },
  mutations: {
    setLeaderboard(state, payload) {
      const newLeaderboard = payload.leaderboard;

      // newLeaderboard.players = newLeaderboard.players.map((p) => {
      //   if (p.thru.includes(':')) {
      //     p.thru = `${p.thru} ${newLeaderboard.timezone}`;
      //   }
      //   return p;
      // });

      if (state.leaderboard) {
        const oldPlayers = transformLeaderboardToPlayerMap(state.leaderboard, state.simulationOptions);
        newLeaderboard.players = orderedPlayersWithScoreDiff(
          oldPlayers, newLeaderboard.players,
        );
      }
      if (state.tournamentInfo) {
        state.leaderboard = leaderboardWithTiers(newLeaderboard, state.tournamentInfo);
      } else {
        state.leaderboard = newLeaderboard;
      }

      state.simulationOptions.originalCutAmount = newLeaderboard.cut_penalty;
    },
    setPicks(state, payload) {
      state.picks = payload.picks;
    },
    setTournaments(state, payload) {
      state.tournaments = payload.tournaments;
    },
    setTournamentName(state, payload) {
      state.tournamentName = payload.tournamentName;
    },
    setTournamentInfo(state, payload) {
      state.tournamentInfo = payload.tournamentInfo;
    },
    setTournamentInterval(state, payload) {
      state.tournamentInterval = payload.id;
    },
    clearTournament(state) {
      clearInterval(state.tournamentInterval);
      state.activeTournament = null;
      state.leaderboard = null;
      state.picks = null;
      state.tournamentInfo = null;
      state.tournamentInterval = null;
    },
    toggleSimulatedCutPenalty(state) {
      state.simulationOptions.cutPenaltyAmount = state.simulationOptions.originalCutAmount;
      state.simulationOptions.simulateCutPenalty = !state.simulationOptions.simulateCutPenalty;
    },
    adjustSimulatedCut(state, payload) {
      state.simulationOptions.cutPenaltyAmount += payload;
    },
  },
  getters: {
    activeTournament({ tournaments }) {
      return tournaments.find(x => x.active);
    },
    getTimeInformationForActiveTournament(_, { activeTournament }) {
      if (activeTournament && activeTournament.timeFormat && activeTournament.timeZone) {
        return {
          format: activeTournament.timeFormat,
          zone: activeTournament.timeZone,
        };
      }

      return {};
    },
    getTournamentName({ tournamentName }) {
      return tournamentName;
    },
    getTournaments({ tournaments }) {
      return tournaments;
    },
    getSimulationOptions({ simulationOptions }) {
      return simulationOptions;
    },
    getTimezone({ leaderboard }) {
      return leaderboard ? leaderboard.timezone : '';
    },
    getCutLine({ leaderboard }) {
      if (leaderboard) {
        return leaderboard.cut_line;
      }
      return '';
    },
    getProjectedCutLine({ leaderboard }) {
      if (leaderboard) {
        return leaderboard.projected_penalty;
      }
      return '';
    },
    getPlayers({ leaderboard, simulationOptions }) {
      if (leaderboard) {
        return transformLeaderboardToPlayerMap(leaderboard, simulationOptions);
      }
      return null;
    },
    getPlayersToPoolParticipants(state, { getPoolParticipants }) {
      return playerIdToPoolParticipants(getPoolParticipants);
    },
    getPoolParticipants(state, { getPlayers }) {
      if (state.picks) {
        return scoreAndRankPoolParticipants(state.picks.pool_participants, getPlayers, state.simulationOptions);
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
    async getLeaderboard({ commit }, payload) {
      commit({
        type: 'setLeaderboard',
        leaderboard: await ScoreboardService.getLeaderboard(payload.tournament),
      });
    },
    async getPicks({ commit }, payload) {
      commit({
        type: 'setPicks',
        picks: await ScoreboardService.getPicks(payload.tournament),
      });
    },
    async hardRefreshPicks({ commit, getters, dispatch }) {
      let tournament = getters.activeTournament;
      if (!tournament) {
        await dispatch('initTournament');
        tournament = getters.activeTournament;
      }

      commit({
        type: 'setPicks',
        picks: await ScoreboardService.getPicks(tournament),
      });
    },
    async getTournaments({ commit }) {
      commit({
        type: 'setTournaments',
        tournaments: await ScoreboardService.getTournaments(),
      });
    },
    async getTournamentInfo({ commit }, payload) {
      commit({
        type: 'setTournamentInfo',
        tournamentInfo: await ScoreboardService.getTournamentInfo(payload.tournament),
      });
    },
    async clearTournament({ commit }) {
      commit('clearTournament');
    },
    async loadTournament({ dispatch, commit }, payload) {
      commit({
        type: 'setTournamentName',
        tournamentName: payload.tournament.tournament_name,
      });
      await dispatch('getTournamentInfo', {
        tournament: payload.tournament,
      });
      await dispatch('getLeaderboard', {
        tournament: payload.tournament,
      });
      await dispatch('getPicks', {
        tournament: payload.tournament,
      });
    },
    async performSimulation({ state }) {
      console.log('in simulation');
      console.log(state);
    },
    async initTournament({
      commit, dispatch, state, getters,
    }, payload) {
      if (payload && payload.tournament) {
        await dispatch('loadTournament', {
          tournament: payload.tournament,
        });
      } else if (!state.tournamentInterval) {
        await dispatch('getTournaments');
        const loadTournament = async () => dispatch('loadTournament', {
          tournament: getters.activeTournament,
        });

        await loadTournament();
        dispatch('performSimulation');
        commit({
          type: 'setTournamentInterval',
          id: setInterval(loadTournament, TOURNAMENT_REFRESH_INTERVAL),
        });
      }
    },
  },
};
