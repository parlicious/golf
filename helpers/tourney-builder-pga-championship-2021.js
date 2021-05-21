var https = require('https');
const fs = require('fs').promises;
var http = require('follow-redirects').http
    , vm = require('vm')
    , concat = require('concat-stream'); // this is just a helper to receive the
                                         // http payload in a single callback
                                         // see https://www.npmjs.com/package/concat-stream

const axios = require('axios');

var host = 'www.bovada.lv';
var path = '/services/sports/event/v2/events/A/description/golf?marketFilterId=rank&preMatchOnly=true&eventsLimit=50&lang=en';
var odds = new Map();
var id = 1;


const getLeaderboardOld = async () => {
    const leaderboardResponse = await axios.get("https://statdata-api-prod.pgatour.com/api/clientfile/Field?T_CODE=r&T_NUM=033&YEAR=2021&format=json");
    return leaderboardResponse.data;
}

const getLeaderboard = async () => {
    const response = await axios.get('http://microservice.pgatour.com/js');
    const remoteSrc = response.data;
    global.window = {};
    vm.runInThisContext(remoteSrc, 'pga_token.js');

    const id = 'id8730931'
    const token = global.window.pgatour.setTrackingUserId(id);
    const url = `https://statdata-api-prod.pgatour.com/api/clientfile/Field?T_CODE=r&T_NUM=033&YEAR=2021&format=json&userTrackingId=${token}`;
    console.log(url);
    const leaderboardResponse = await axios.get(url);
    return leaderboardResponse.data;
};

// getLeaderboard().then(console.log).catch();

var golfers = null;
var tournament_info = {
    "id": "2021-pga-championship",
    "tournament_name": "2021 US Open",
    "timestamp": Date.now(),
    "picks_per_tier": {
        "A": 1,
        "B": 2,
        "C": 3,
        "D": 4,
        "E": 1
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

const bovada = async () => {
    const dkResponse = await axios.get(`https://sportsbook.draftkings.com//sites/US-SB/api/v2/eventgroup/88670020/full?includePromotions=true&format=json`);
    const dkField = dkResponse.data.eventGroup.offerCategories[0].offerSubcategoryDescriptors[0].offerSubcategory.offers[0][0].outcomes
    var prevodds = 0;

    for(var i = 0; i < dkField.length; i++) {
        var player = {
            "tournament_id": null,
            "id": null,
            "first_name": null,
            "last_name": null,
            "name": dkField[i].label,
            "decimal_odds": parseFloat(dkField[i].oddsDecimal),
            "fractional_odds": dkField[i].oddsFractional,
            "tier": null
        }
        //tournament_field.field.push(player);
        if(!odds.has(player.name.toLowerCase())) odds.set(player.name.toLowerCase(), player);
        else console.log(player);
    }

    return dkField;
    // getfieldfrompga();
};

// bovada().then(console.log).catch(console.error);

const buildit = async () => {
    const golfers = (await getLeaderboard()).Tournament.Players
    const bovadaField = await bovada();
    //need to fix the masters hard coding
    for(let g = 0; g < golfers.length; g++) {
        let golfer = golfers[g];
        //skip placeholders
        if(golfer.id === "90001") continue;
        //standardize the record
        const [lastname, firstname] = golfer.PlayerName.split(',').map(s => s.trim())
        let newgolfer = {
            "id": id++,
            "first_name":firstname,
            "last_name":lastname,
            "country_code": 'USA',
            "masters_id": parseInt(golfer.TournamentPlayerId),
            "pga_id": parseInt(golfer.playerId),
            "open_id": null,
            "us_open_id": parseInt(golfer.TournamentPlayerId),
        };
        var golferkey = newgolfer.first_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + " " + newgolfer.last_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if(!odds.has(golferkey.toLowerCase())) {
            //create a new player with 500:1 odds?
            var player = {
                "tournament_id": newgolfer.us_open_id,
                "id": newgolfer.id,
                "first_name": newgolfer.first_name,
                "last_name": newgolfer.last_name,
                "decimal_odds": 502,
                "fractional_odds": "501/1",
                "tier": null
            };
            tournament_info.field.push(player);
        } else {
            var oddsgolf = odds.get(golferkey.toLowerCase());
            var player = {
                "tournament_id": newgolfer.us_open_id,
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

    return tournament_info;
};

const saveTournamentInfo = async (tournament_info) => {
    await fs.writeFile('tournament_info.json', JSON.stringify(tournament_info, null, 4));
};

const main = async () => {
    const tournamentInfo = await buildit();
    await saveTournamentInfo(tournament_info);
};

main().catch(console.error);