//load the file
const fs = require('fs');

let rawdata = fs.readFileSync('tournament_info.json');  
let tournament_info = JSON.parse(rawdata);  

//rules
//to determine event rules (tiers and picks per tier) use the following logic:
// if the field is less than 100 use 4 tiers (A,B,C,D)
//      find tier breaks using these rules:
//          A - 95th - 100th percentile
//          B - 80th - 94th percentile
//          C - 50th - 79th percentile
//          D - 0 - 49th percentile
// if the field has more than 100, use 5 tiers:
//          A - 95th - 100th percentile
//          B - 80th - 94th percentile
//          C - 50th - 79th percentile
//          D - 10th - 49th percentile
//          E - 0 - 9th percentile
// allowed picks determined as follows:
//  A - if < 4 players in A tier, choose 1, otherwise, choose 2
//  B - 2
//  C - 3
//  D - 4
//  E - 1

var currenttier = "A";
var previousodds = 0;

for(var i = 0; i < tournament_info.field.length; i++) {
    var dude = tournament_info.field[i];
    var countofas = 0;
    //if the odds are the same keep the tier the same
    if(dude.decimal_odds == previousodds) {
        dude.tier = currenttier;
        if (currenttier == "A") countofas;
    }
    else if (i < 4) {
        currenttier = "A";
        countofas++;
        previousodds = dude.decimal_odds;
        dude.tier = currenttier;
    } else if (i < 15) {
        currenttier = "B";
        previousodds = dude.decimal_odds;
        dude.tier = currenttier;
    } else if (i < 35) {
        currenttier = "C";
        previousodds = dude.decimal_odds;
        dude.tier = currenttier;
    } else if (i < 100) {
        currenttier = "D";
        previousodds = dude.decimal_odds;
        dude.tier = currenttier;
    } else {
        currenttier = "E";
        previousodds = dude.decimal_odds;
        dude.tier = currenttier;
    }
}

tournament_info.picks_per_tier.A = countofas > 4 ? 2 : 1
tournament_info.picks_per_tier.B = 2;
tournament_info.picks_per_tier.C = 3;
tournament_info.picks_per_tier.D = 4;
tournament_info.picks_per_tier.D = tournament_info.field.length > 100 ? 1 : 0;
console.log(JSON.stringify(tournament_info));