const info = require('./tournament_info.json');
const fs = require('fs');

const container = {
    "version": 1,
    "round": 4,
    "cut_line": null,
    "cut_penalty": 6,
    "timezone": "EDT",
    "refreshed": 1621861612382,
    "players": []
};

const prototype = {
    "id": 1810,
    "first_name": "Phil",
    "last_name": "Mickelson",
    "thru": "",
    "teetime": null,
    "today": "",
    "to_par": "",
    "position": "1",
    "individual_pen": null,
    "individual_bonus": null,
    "status": "A"
};


const players = info.field.map(it => {
    return {
        ...prototype,
        id: it.tournament_id,
        first_name: it.first_name,
        last_name: it.last_name,
    };
})

const leaderboard = {
    ...container,
    players
};

fs.writeFileSync('./leaderboard.json', JSON.stringify(leaderboard, null, 2));