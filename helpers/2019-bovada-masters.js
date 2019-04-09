var https = require('https');

var host = 'www.bovada.lv';
var path = '/services/sports/event/v2/events/A/description/golf/golf-futures?marketFilterId=rank&preMatchOnly=true&lang=en';
var odds = new Map();


var golfers = null;
var tournament_info = {
    "id": "2019-masters",
    "tournament_name": "2019 Masters",
    "timestamp": Date.now(),
    "picks_per_tier": {
        "A": 0,
        "B": 0,
        "C": 0,
        "D": 0,
        "E": 0
    },
    "field": [

    ]
};

var options = {
    host: host,
    path: path,
    method: 'GET'
};

var req = https.request(options, (res) => {
    var data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });

    res.on('error', function (e) {
        console.log(e);
    });

    res.on('end', () => {
        var bovadadata = JSON.parse(data);
        var bovadaobj = bovadadata[0];
        var bovtourney = bovadaobj.events[0];
        var bovfield = bovtourney.displayGroups[0].markets[0].outcomes;
        var prevodds = 0;

        for(var i = 0; i < bovfield.length; i++) {
            var player = {
                "tournament_id": null,
                "id": null,
                "first_name": null,
                "last_name": null,
                "name": bovfield[i].description,
                "decimal_odds": parseFloat(bovfield[i].price.decimal),
                "fractional_odds": bovfield[i].price.fractional,
                "tier": null
            }
            //tournament_field.field.push(player);
            if(!odds.has(player.name.toLowerCase())) odds.set(player.name.toLowerCase(), player);
            else console.log(player);
        }
        getFieldFromMasters();
    });
});

req.end();

function getFieldFromMasters() {
    //eventually turn this into a secure call to s3 or our db
    var parhost = 's3.amazonaws.com';
    var parpath = '/parlicious-data/golfers.json';
    var parreq = https.request({
        host: parhost,
        path: parpath,
        method: 'GET'
    }, (res) => {
        var golfdata = '';
        res.on('data', function (chunk) {
            golfdata += chunk;
        });

        res.on('error', function (e) {
            console.log(e);
        });

        res.on('end', () => {
            var pardata = JSON.parse(golfdata);
            golfers = pardata.players;
            buildit();
        });
    });
    parreq.end();
}

function buildit() {
    //need to fix the masters hard coding
    golfers.forEach(golfer => {
        var golferkey = golfer.first_name + " " + golfer.last_name;
        if(!odds.has(golferkey.toLowerCase())) {
            //create a new player with 500:1 odds?
            var player = {
                "tournament_id": golfer.masters_id,
                "id": golfer.id,
                "first_name": golfer.first_name,
                "last_name": golfer.last_name,
                "decimal_odds": 501,
                "fractional_odds": "500/1",
                "tier": null
            };
            tournament_info.field.push(player);
        } else {
            var oddsgolf = odds.get(golferkey.toLowerCase());
            var player = {
                "tournament_id": golfer.masters_id,
                "id": golfer.id,
                "first_name": golfer.first_name,
                "last_name": golfer.last_name,
                "decimal_odds": oddsgolf.decimal_odds,
                "fractional_odds": oddsgolf.fractional_odds,
                "tier": null
            };
            tournament_info.field.push(player);
        }
    });
    tournament_info.field.sort((a, b) => {return a.decimal_odds-b.decimal_odds;});
    console.log(JSON.stringify(tournament_info));

}