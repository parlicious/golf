import * as _ from 'lodash';
import moment from 'moment-timezone';

const inProgressOrFinishedThruPattern = /[0-9]+|F/;

export const DisplayUtils = {
  convertTeeTimeToLocalTimeZone(teeTimeString, teeTimeFormat, teeTimeZone) {
    if(!teeTimeString){
      return "";
    }
    let baseString = teeTimeString;
    let modifier = '';
    if(teeTimeString.endsWith('*')) {
      baseString = teeTimeString.split(-1);
      modifier = '*';
    }
    const toZone = moment.tz.guess();
    const result = moment.tz(baseString, teeTimeFormat, teeTimeZone);
    return `${result.tz(toZone).format(teeTimeFormat)}${modifier}`;
  },
  getPickThru(pick, timeInformation) {
    if (pick.thru.includes(':') || pick.thru.includes('--')) {
      if (timeInformation && timeInformation.zone && timeInformation.format) {
        return this.convertTeeTimeToLocalTimeZone(pick.teetime, timeInformation.format, timeInformation.zone);
      }
    }

    if (inProgressOrFinishedThruPattern.test(pick.thru)) {
      return pick.thru;
    }

    return pick.teetime;
  },
  sortedPicks(picks) {
    const newPicks = _.cloneDeep(picks);
    const sortFn = (a, b) => a.to_par - b.to_par;
    const cutPlayers = newPicks.filter(p => p.status === 'C');
    const activePlayers = newPicks.filter(p => p.status !== 'C');
    return [...activePlayers.sort(sortFn), ...cutPlayers.sort(sortFn)];
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
    const { possible, thru } = participant.picks
      .map(p => (p.status === 'C' ? 18 : p.thru)) // get thru
      .map(p => (p.replace ? p.replace('*', '') : p))
      .map(p => (p.trim && p.trim() === '' ? 0 : p)) // handle blanks
      .map(p => (p === 'F' ? 18 : p)) // handle finished
      .map(p => (isNaN(p) ? 0 : p)) // handle non numbers
      .map(p => parseInt(p)) // convert to int
      .reduce((acc, val) => ({
        possible: acc.possible + 18,
        thru: acc.thru + val,
      }), { possible: 0, thru: 0 }); // sum

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
  getParticipantByName(participants, name) {
    return participants.find(p => p.name === name)
  },
};
