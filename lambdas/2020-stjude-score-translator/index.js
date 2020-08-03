// testing s3 deploy test
const AWS = require('aws-sdk');
const axios = require('axios');
const s3 = new AWS.S3();
const vm = require('vm');
// const https = require('https');

const getLeaderboard = async () => {
    const response = await axios.get('http://microservice.pgatour.com/js');
    const remoteSrc = response.data;
    global.window = {};
    vm.runInThisContext(remoteSrc, 'pga_token.js');

    const id = 'id8730931';
    const token = global.window.pgatour.setTrackingUserId(id);
    const url = `http://lbdata.pgatour.com/2020/r/476/leaderboard.json?userTrackingId=${token}`;
    console.log(url);
    const leaderboardResponse = await axios.get(url);
    return leaderboardResponse.data;
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
        players: [],
    };
    getLeaderboard().then((pgadata) => {
        // build our model
        leaderboard.cut_line = pgadata.currentRound === 2 ? pgadata.tournamentCut.projectedCut : null;
        leaderboard.round = pgadata.currentRound;
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
                individual_bonus: ((leaderboard.round === 3 || leaderboard.round === 4) && player.currentPosition === '1') ? leaderboard.cut_penalty * -2 : null,
                status: player.currentPosition === 'CUT' ? 'C' : 'A',
            };
            leaderboard.players.push(newplayer);
        }
        const key = 'leaderboards/stjude/2020/leaderboard.json';

        // console.log(leaderboard);
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

buildleaderboard(() => {}, 1);
