var https = require('https');
const fs = require('fs').promises;
var http = require('follow-redirects').http
    , vm = require('vm')
    , concat = require('concat-stream'); // this is just a helper to receive the
                                         // http payload in a single callback
                                         // see https://www.npmjs.com/package/concat-stream

const axios = require('axios');
let leaderboard = {
    "version": 1,
    "round": "0001",
    "cut_line": "",
    "cut_penalty": 0,
    "timezone": "EDT",
    "refreshed": 1618196594901,
    "players": []
};

const getLeaderboard = async () => {
    const leaderboardResponse = await axios.get("https://www.masters.com/en_US/scores/feeds/2022/players/players.json");
    return leaderboardResponse.data;
}

const buildit = async () => {
    const golfers = (await getLeaderboard()).players

    for(let g = 0; g < golfers.length; g++) {
        let golfer = golfers[g];
        let newgolfer = 
        {
            "id": parseInt(golfer.id,10),
            "first_name": golfer.first_name,
            "last_name": golfer.last_name,
            "thru": "",
            "teetime": "",
            "today": "E",
            "to_par": "E",
            "position": "T1",
            "individual_pen": null,
            "individual_bonus": null,
            "status": "F"
          };
          leaderboard.players.push(newgolfer);
    }
    return leaderboard;
}

const saveleaderboardInfo = async (leaderboard) => {
    await fs.writeFile('leaderboard.json', JSON.stringify(leaderboard, null, 4));
};

const main = async () => {
    const leaderboardinfo = await buildit();
    await saveleaderboardInfo(leaderboardinfo);
};

main().catch(console.error);