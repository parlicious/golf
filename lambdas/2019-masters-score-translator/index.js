// testing s3 deploy test
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var https = require('https');

var host = '2019.masters.com';
var path = '/en_US/scores/feeds/scores.json';

var options = {
    host: host,
    path: path,
    method: 'GET'
};

exports.handler = (event, context, callback) => {
    let leaderboard = {
        "version": 1,
        "round": null,
        "cut_line": null,
        "cut_penalty": null,
        "timezone": "EDT",
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
            let mastersdata = JSON.parse(data);

            //build our model
            leaderboard.cut_line = mastersdata.data.cutLine;
            leaderboard.round = mastersdata.data.currentRound;
            let players = mastersdata.data.player;
            for(var i = 0; i < players.length; i++) {
                let player = players[i];
                let newplayer = {
                    'id': parseInt(player.id),
                    'first_name': player.first_name,
                    'last_name': player.last_name,
                    'thru': player.thru,
                    'teetime': player.teetime,
                    'today': player.today,
                    'to_par': player.topar,
                    'position': player.pos,
                    "individual_pen": player.status == "C" ? leaderboard.cut_penalty * 2 : null,
                    "individual_bonus": ((leaderboard.round == "F" || leaderboard.round == "4") && player.pos == "1") ? leaderboard.cut_penalty * -2 : null,
                    "status": player.status
                };
                leaderboard.players.push(newplayer);
            }
            
            const key = "leaderboards/masters/2019/leaderboard.json";
        
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
                    callback(null, leaderboard);
                }
                else {
                    console.log(data);           // successful response
                    callback(null, leaderboard);
                }
            });
        });
    });
    req.end();
};
