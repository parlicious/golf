// testing s3 deploy test

var https = require('https');

var host = '2018.masters.com';
var path = '/en_US/scores/feeds/scores.json';

var leaderboard = {
    "version": 1,
    "round": "F",
    "cut_line": 6,
    "cut_penalty": 7,
    "timezone": "EDT",
    "players": [
        // {
        //     "id":null,
        //     "first_name":null,
        //     "last_name":null,
        //     "thru":null,
        //     "teetime":null,
        //     "today":null,
        //     "to_par":null,
        //     "status":null
        // }
    ]
};

var options = {
    host: host,
    path: path,
    method: 'GET'
};

exports.handler = (event, context, callback) => {
    var req = https.request(options, (res) => {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('error', function (e) {
            console.log(e);
        });

        res.on('end', () => {
            var mastersdata = JSON.parse(data);

            //build our model
            leaderboard.cut_line = mastersdata.data.cutLine;
            let players = mastersdata.data.player;
            players.forEach(player => {
                let newplayer = {
                    'id': player.id,
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
            });
            callback(null, leaderboard);
        });
    });
    req.end();
};
