import * as _ from 'lodash';

const inProgressOrFinishedThruPattern = /[0-9]+|F/;

export const DisplayUtils = {
  getPickThru(pick) {
    if (inProgressOrFinishedThruPattern.test(pick.thru)) {
      return pick.thru;
    }
    return pick.teetime;
  },
  sortedPicks(picks) {
    const newPicks = _.cloneDeep(picks);
    return newPicks.sort((a, b) => a.to_par - b.to_par);
  },
  getPenaltyColumn(pick) {
    if (pick.individual_bonus) {
      return pick.individual_bonus;
    }
    if (pick.individual_pen) {
      return pick.individual_pen;
    }
    return 0;
  },
  getTotalPenalty(participant) {
    return participant.picks.reduce((acc, val) => acc + this.getPenaltyColumn(val), 0);
  },
  getTotalThru(participant) {
    return participant.picks
      .map(p => p.thru)
      .map(p => (p === 'F' ? 18 : p))
      .map(p => p.trim() === '' ? 0 : p)
      .map(p => (isNaN(p) ? 0 : p))
      .map(p => parseInt(p))
      .reduce((acc, val) => acc + (val), 0);
  },
  getNameAbbreviation(name) {
    const names = name.trim().split(' ');
    return names[0];
    // if (names.length === 1) {
    //   return name.substring(0, 3);
    // }
    // return names.map(n => n[0]).join('');
  },
  wouldMakeCut(cutLine, player){
    const score = player.to_par === 'E' ? 0 : parseInt(player.to_par);
    return score <= parseInt(cutLine);
  },
  zeroOr(val) {
    return val || 'E';
  },
};
