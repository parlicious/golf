const inProgressOrFinishedThruPattern = /[0-9]+|F/;
import * as _ from 'lodash';

export const DisplayUtils =  {
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
};
