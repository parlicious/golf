import { ApiService } from './api';
import { sha256 } from './security';

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

  async submitPicks(picks = [], email = '', name = '', editKey = '') {
    const hashedEditKey = await sha256(editKey);

    const pickRequest = {
      guid: '',
      tournament: this.activeTournament.title,
      year: this.activeTournament.year,
      email,
      name,
      editKey: hashedEditKey,
      picks,
    };

    return ApiService.submitPicks(pickRequest);
  },
};

export default PicksService;
