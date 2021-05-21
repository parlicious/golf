const fs = require('fs');

let rawdata = fs.readFileSync('tournament_info.json');
let tournament_info = JSON.parse(rawdata);

const makePlayer = (player) => {
    return {
        "id": player.tournament_id,
        "first_name": player.first_name,
        "last_name": player.last_name,
        "thru": "F",
        "teetime": null,
        "today": "E",
        "to_par": "0",
        "position": "1",
        "individual_pen": null,
        "individual_bonus": null,
        "status": "A"
    }
}

const leaderboard = {
    "version": 1,
    "round": 4,
    "cut_line": null,
    "cut_penalty": 3,
    "timezone": "EDT",
    "refreshed": 1597022750637,
    players: tournament_info.field.map(makePlayer)
}

fs.writeFileSync('leaderboard.json', JSON.stringify(leaderboard, null, 4));
