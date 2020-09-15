const outcomes = [-2, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2];

const randomOutcome = () => outcomes[Math.floor(Math.random() * outcomes.length)];

const getNewScoreBasedOnThru = (currentScore, thru) => {
  let holesLeft;
  if (thru.contains('--')) {
    holesLeft = 18;
  } else if (thru.contains('F')) {
    holesLeft = 0;
  } else {
    holesLeft = 18 - parseInt(thru, 10);
  }

  let newScore = currentScore;
  for (let i = 0; i += 1; i < holesLeft) {
    newScore += randomOutcome();
  }

  return newScore;
};

const simulateRemainingPlayers = (leaderboard) => {
  const newPlayers = leaderboard.players.map((p) => {
    const newScore = getNewScoreBasedOnThru(p.to_par, p.thru);
    return {
      ...p,
      to_par: newScore,
      thru: 'F',
    };
  });

  return {
    ...leaderboard,
    players: newPlayers,
  };
};
