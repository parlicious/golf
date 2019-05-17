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
    // display either penalty or bonus
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
    const {possible, thru} = participant.picks
      .map(p => (p.status === 'C' ? 18 : p.thru)) // get thru
      .map(p => (p.replace ? p.replace('*', '') : p))
      .map(p => (p.trim && p.trim() === '' ? 0 : p)) // handle blanks
      .map(p => (p === 'F' ? 18 : p)) // handle finished
      .map(p => (isNaN(p) ? 0 : p)) // handle non numbers
      .map(p => parseInt(p)) // convert to int
      .reduce((acc, val) => {
        return {
          possible: acc.possible + 18,
          thru: acc.thru + val,
        };
      }, { possible: 0, thru: 0 }); // sum

    return possible - thru;
  },
  getNameAbbreviation(name) {
    const names = name.trim().split(' ');
    return names[0];
    // if (names.length === 1) {
    //   return name.substring(0, 3);
    // }
    // return names.map(n => n[0]).join('');
  },
  displayPlayerCut(cutLine, player) {
    if (player.status === 'C') {
      return true;
    }

    if (cutLine) {
      const score = player.to_par === 'E' ? 0 : parseInt(player.to_par);
      return score > parseInt(cutLine);
    }

    return false;
  },
  zeroOr(val) {
    if (val === '') {
      return '';
    }
    return val || 'E';
  },
};
