var https = require('https');
var http = require('follow-redirects').http
    , vm = require('vm')
    , concat = require('concat-stream'); // this is just a helper to receive the
                                         // http payload in a single callback
                                         // see https://www.npmjs.com/package/concat-stream

var host = 'www.bovada.lv';
var path = '/services/sports/event/v2/events/A/description/golf?marketFilterId=rank&preMatchOnly=true&eventsLimit=50&lang=en';
var odds = new Map();
var id = 1;

const getPgaUrl = () => {
    http.get({
            host: 'microservice.pgatour.com',
            port: 80,
            path: '/js'
        },
        function(res) {
            res.setEncoding('utf8');
            res.pipe(concat({ encoding: 'string' }, function(remoteSrc) {
                const id = 'id8730931'
                const window = {}
                vm.runInThisContext(remoteSrc, 'remote_modules/hello.js');
                const token = global.window.pgatour.setTrackingUserId(id)
                global.host = "lbdata.pgatour.com"
                global.path = `/2020/r/476/leaderboard.json?userTrackingId=${token}`
            }));
        });
}

var golfers = null;
var tournament_info = {
    "id": "2019-usopen",
    "tournament_name": "2019 US Open",
    "timestamp": Date.now(),
    "picks_per_tier": {
        "A": 0,
        "B": 0,
        "C": 0,
        "D": 0,
        "E": 0
    },
    "field": [
        // {
        //     "tournament_id": null,
        //     "id": null,
        //     "first_name": null,
        //     "last_name": null,
        //     "decimal_odds": null,
        //     "fractional_odds": null,
        //     "tier": null
        // }
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
        var bovadaobj = bovadadata[1];
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
        getfieldfrompga();
    });
});

req.end();

function getfieldfrompga() {
    //eventually turn this into a secure call to s3 or our db
    var pgahost = 'data.pga.com';
    var pgapath = '/event/R/current/leaderboard.json';
    var pgareq = https.request({
        host: pgahost,
        path: pgapath,
        method: 'GET'
    }, (res) => {
        var pgadata = '';
        res.on('data', function (chunk) {
            pgadata += chunk;
        });

        res.on('error', function (e) {
            console.log(e);
        });

        res.on('end', () => {
            pgagolfers = JSON.parse(pgadata);
            golfers = pgagolfers.player;
            buildit();
        });
    });
    pgareq.end();}

function buildit() {
    //need to fix the masters hard coding
    for(let g = 0; g < golfers.length; g++) {
        let golfer = golfers[g];
        //skip placeholders
        if(golfer.id === "90001") continue;
        //standardize the record
        let newgolfer = {
            "id": id++,
            "first_name":golfer.firstName,
            "last_name":golfer.lastName,
            "country_code": golfer.country,
            "masters_id": parseInt(golfer.id),
            "pga_id": parseInt(golfer.id),
            "open_id": null,
            "us_open_id": null
        };
        var golferkey = newgolfer.first_name + " " + newgolfer.last_name;
        if(!odds.has(golferkey.toLowerCase())) {
            //create a new player with 500:1 odds?
            console.log(golferkey);
            var player = {
                "tournament_id": newgolfer.masters_id,
                "id": newgolfer.id,
                "first_name": newgolfer.first_name,
                "last_name": newgolfer.last_name,
                "decimal_odds": 501,
                "fractional_odds": "500/1",
                "tier": null
            };
            tournament_info.field.push(player);
        } else {
            var oddsgolf = odds.get(golferkey.toLowerCase());
            var player = {
                "tournament_id": newgolfer.masters_id,
                "id": newgolfer.id,
                "first_name": newgolfer.first_name,
                "last_name": newgolfer.last_name,
                "decimal_odds": oddsgolf.decimal_odds,
                "fractional_odds": oddsgolf.fractional_odds,
                "tier": null
            };
            tournament_info.field.push(player);
        }
    }
    tournament_info.field.sort((a, b) => {return a.decimal_odds-b.decimal_odds;});
    console.log(JSON.stringify(tournament_info));

}