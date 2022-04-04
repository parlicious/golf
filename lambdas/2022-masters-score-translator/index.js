// testing s3 deploy test
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var https = require('https');

var host = 'www.masters.com';
var path = '/en_US/scores/feeds/2022/scores.json';

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
                    "individual_bonus": ((leaderboard.round == "0001" || leaderboard.round == "0010") && player.pos == "1") ? leaderboard.cut_penalty * -2 : null,
                    "status": player.status
                };
                leaderboard.players.push(newplayer);
            }
            
            const key = "leaderboards/masters/2022/leaderboard.json";
        
            let params = {
                Bucket : process.env.LEADERBOARD_BUCKET,
                Key : key,
                Body : JSON.stringify(leaderboard),
                ACL:'public-read',
                ContentType: "application/json"
            };
            console.log(leaderboard);
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

