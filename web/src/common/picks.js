import { ApiService } from './api';

export const PicksService = {

  activeTournament: {},
  tournamentField: {},
  golfers: [],

  async load() {
    const tournaments = (await ApiService.getTournaments()).data;
    this.activeTournament = tournaments.find(x => x.active);
    this.tournamentField = (await ApiService.get(this.activeTournament.field)).data;

    return {
      golfers: this.golfers,
      activeTournament: this.activeTournament,
      tournamentField: this.tournamentField,
    };
  },

  async getIndividualPicks(email) {
    return ApiService.getIndividualPicks(
      email,
      this.activeTournament.title,
      this.activeTournament.year,
    );
  },
};

export default PicksService;
