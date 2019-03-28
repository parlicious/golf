var https = require('https');

var host = '2018.masters.com';
var path = '/en_US/scores/feeds/scores.json';

var leaderboard = {
  'version': 1,
  'round': null,
  'cut_line': null,
  'timezone': 'EDT',
  'players': [
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
      leaderboard.round = 1;
      let players = mastersdata.data.player;
      players.forEach(player => {
        let newplayer = {
          'id': player.id,
          'first_name': player.first_name,
          'last_name': player.last_name,
          'thru': player.thru,
          'teetime': player.teetime,
          'today': player.today,
          'to_par': player.to_par,
          'status': player.status
        };
        leaderboard.players.push(newplayer);
      });
      callback(null, leaderboard);
    });
  });
  req.end();
};
