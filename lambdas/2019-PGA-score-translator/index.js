// testing s3 deploy test
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const https = require('https');

const host = 'data.pga.com';
const path = '/event/R014/2019/leaderboard.json';

const options = {
  host,
  path,
  method: 'GET',
};

function buildleaderboard(callback, count) {
  const newcount = count + 1;
  console.log(`count: ${count}`);
  const leaderboard = {
    version: 1,
    round: null,
    cut_line: null,
    cut_penalty: null,
    timezone: 'EDT',
    refreshed: Date.now(),
    players: [

    ],
  };
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('error', (e) => {
      console.log(e);
    });

    res.on('end', () => {
      const pgadata = JSON.parse(data);

      // build our model
      leaderboard.cut_line = pgadata.roundTotal === 2 ? pgadata.tournamentCut.projectedCut : null;
      leaderboard.round = pgadata.roundTotal;
      const players = pgadata.player;
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const newplayer = {
          id: parseInt(player.id),
          first_name: player.firstName,
          last_name: player.lastName,
          thru: player.thru,
          teetime: player.currentTeetime,
          today: player.currentParRelative,
          to_par: player.totalParRelative === '-' ? getScoreTotal(player.round) : player.totalParRelative,
          position: player.currentPosition,
          individual_pen: player.currentPosition === 'CUT' ? leaderboard.cut_penalty * 2 : null,
          individual_bonus: ((leaderboard.round === 3 || leaderboard.round === 4) && player.currentPosition === '1') ? leaderboard.cut_penalty * -2 : null,
          status: player.currentPosition === 'CUT' ? 'C' : 'A',
        };
        leaderboard.players.push(newplayer);
      }
      const key = 'leaderboards/pga/2019/leaderboard.json';

      const params = {
        Bucket: process.env.LEADERBOARD_BUCKET,
        Key: key,
        Body: JSON.stringify(leaderboard),
        ACL: 'public-read',
        ContentType: 'application/json',
      };
      s3.putObject(params, (err, data) => {
        if (err) {
          console.log(err, err.stack); // an error occurred
        } else {
          console.log(data); // successful response
          if (count < 5) {
            setTimeout(() => buildleaderboard(callback, newcount), 10000);
          } else callback(null, leaderboard);
        }
      });
    });
  });
  req.end();
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

exports.handler = (event, context, callback) => {
  buildleaderboard(callback, 1);
};

// uncomment for local testing with: node index.js
// exports.handler(null, null, (res) => {
//   console.log(res);
// });
