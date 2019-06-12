// testing s3 deploy test
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var https = require('https');

var host = 'data.pga.com';
var path = '/event/R/current/leaderboard.json';

var options = {
    host: host,
    path: path,
    method: 'GET'
};

exports.handler = (event, context, callback) => {
    buildleaderboard(callback, 1);
};

function buildleaderboard(callback, count){
    const newcount = count + 1;
    console.log(`count: ${count}`);
    let leaderboard = {
        "version": 1,
        "round": null,
        "cut_line": null,
        "cut_penalty": null,
        "projected_penalty": null,
        "timezone": "PDT",
        "refreshed": Date.now(),
        "players": [
    
        ]
    };
    let req = https.request(options, (res) => {
        let data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('error', function (e) {
            console.log(e);
        });

        res.on('end', () => {
            let pgadata = JSON.parse(data);

            //build our model
            leaderboard.cut_line = pgadata.currentRound == 2 ? pgadata.tournamentCut.score : null;
            leaderboard.round = pgadata.currentRound;
            let players = pgadata.player;
            for(var i = 0; i < players.length; i++) {
                let player = players[i];
                let newplayer = {
                    'id': parseInt(player.id),
                    'first_name': player.firstName,
                    'last_name': player.lastName,
                    'thru': player.thru,
                    'teetime': player.currentTeetime,
                    'today': player.currentParRelative,
                    'to_par': player.totalParRelative == "-" ? getScoreTotal(player.round) : player.totalParRelative,
                    'position': player.currentPosition,
                    "individual_pen": player.currentPosition == "CUT" ? leaderboard.cut_penalty * 2 : null,
                    "individual_bonus": ((leaderboard.round == 3 || leaderboard.round == 4) && player.currentPosition == "1") ? leaderboard.cut_penalty * -2 : null,
                    "status": player.currentPosition == "CUT" || player.currentPosition == "WD" ? "C" : "A"
                };
                if(newplayer.position == "WD") {
                    newplayer.individual_pen = leaderboard.cut_penalty * 3;
                }
                leaderboard.players.push(newplayer);
            }
            leaderboard.projected_penalty = null;
            const key = "leaderboards/us-open/2019/leaderboard.json";
        
            let params = {
                Bucket : process.env.LEADERBOARD_BUCKET,
                Key : key,
                Body : JSON.stringify(leaderboard),
                ACL:'public-read',
                ContentType: "application/json"
            };
            s3.putObject(params, function(err, data) {
                if (err) 
                {
                    console.log(err, err.stack); // an error occurred
                }
                else {
                    console.log(data);           // successful response
                    if(count < 5) {
                        setTimeout(() => buildleaderboard(callback, newcount), 10000);
                    } else callback(null,leaderboard);
                 }
            });
        });
    });
    req.end();
}

function getScoreTotal(rounds) {
    let total = 0;
    
    for(let i = 0; i < rounds.length; i++) {
        let round = rounds[i];
        let score = parseInt(round.parRelative, 10);
        if(!isNaN(score)) total = total + score;
    }

    return total;
}
