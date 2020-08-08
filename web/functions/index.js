const functions = require('firebase-functions');
const axios = require('axios');

const admin = require('firebase-admin');

admin.initializeApp();

const storage = admin.storage();
const fs = require('fs').promises;
const os = require('os');
const vm = require('vm');

const getLeaderboard = async () => {
  const response = await axios.get('http://microservice.pgatour.com/js');
  const remoteSrc = response.data;
  global.window = {};
  vm.runInThisContext(remoteSrc, 'pga_token.js');

  const id = 'id8730931';
  const token = global.window.pgatour.setTrackingUserId(id);
  const url = `https://lbdata.pgatour.com/2020/r/033/leaderboard.json?userTrackingId=${token}`;
  console.log(url);
  const leaderboardResponse = await axios.get(url);
  return leaderboardResponse.data;
};

async function buildleaderboard() {
  const leaderboard = {
    version: 1,
    round: null,
    cut_line: null,
    cut_penalty: 3,
    timezone: 'EDT',
    refreshed: Date.now(),
    players: [],
  };

  const pgadata = await getLeaderboard();
  // build our model
  leaderboard.cut_line = pgadata.tournamentRoundId === 2 ? pgadata.cutLines[0].cut_line_score : null;
  leaderboard.round = pgadata.tournamentRoundId;
  const players = pgadata.rows;
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const newplayer = {
      id: parseInt(player.playerId),
      first_name: player.playerNames.firstName,
      last_name: player.playerNames.lastName,
      thru: player.thru,
      teetime: player.teeTime,
      today: player.round,
      to_par: player.total === '-' ? getScoreTotal(player.round) : player.total,
      position: player.positionCurrent,
      individual_pen: player.positionCurrent === 'CUT' ? leaderboard.cut_penalty * 2 : null,
      individual_bonus: ((leaderboard.round === 3 || leaderboard.round === 4) && player.positionCurrent === '1') ? leaderboard.cut_penalty * -2 : null,
      status: player.positionCurrent === 'CUT' ? 'C' : 'A',
    };
    leaderboard.players.push(newplayer);
  }
  const key = 'leaderboards/pga/2020/leaderboard.json';

  await fs.writeFile(`${os.tmpdir()}/leaderboard.json`, JSON.stringify(leaderboard, null, 4));

  await storage
    .bucket()
    .upload(`${os.tmpdir()}/leaderboard.json`);

  return JSON.stringify(leaderboard);
}

function getScoreTotal(rounds) {
  let total = 0;

  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];
    const score = parseInt(round.parRelative, 10);
    if (!isNaN(score)) total += score;
  }

  return total;
}


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
    await buildleaderboard();
});
