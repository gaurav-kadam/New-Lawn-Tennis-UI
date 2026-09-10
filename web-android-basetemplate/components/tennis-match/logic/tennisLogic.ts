import {
  PlayerId,
  TennisMatchState,
  TeamId,
  TennisEventType,
} from '../types/tennis.types';

//    PLAYER HELPERS

const otherPlayer = (
  player: PlayerId
): PlayerId =>
  player === 'PLAYER1'
    ? 'PLAYER2'
    : 'PLAYER1';

    //    TEAM HELPERS

export const getTeamForPlayer = (
  state: TennisMatchState,
  player: PlayerId
): TeamId => {
  if (state.matchType === 'SINGLES') {
    return player === 'PLAYER1'
      ? 'TEAM1'
      : 'TEAM2';
  }

  // DOUBLES
  // TEAM 1 = PLAYER1 + PLAYER2
  // TEAM 2 = PLAYER3 + PLAYER4

  return player === 'PLAYER1' ||
    player === 'PLAYER2'
    ? 'TEAM1'
    : 'TEAM2';
};

const getOpposingTeam = (
  state: TennisMatchState,
  player: PlayerId
): TeamId => {
  return getTeamForPlayer(
    state,
    player
  ) === 'TEAM1'
    ? 'TEAM2'
    : 'TEAM1';
};

export function getDoublesServiceOrder(
  firstServer: PlayerId,
  opposingFirstServer: PlayerId
): PlayerId[] {
  const team = (player: PlayerId): TeamId =>
    player === 'PLAYER1' || player === 'PLAYER2'
      ? 'TEAM1'
      : 'TEAM2';
  if (team(firstServer) === team(opposingFirstServer)) {
    throw new Error('Doubles first servers must be on opposing teams');
  }
  const teammate = (player: PlayerId): PlayerId => {
    if (player === 'PLAYER1') return 'PLAYER2';
    if (player === 'PLAYER2') return 'PLAYER1';
    if (player === 'PLAYER3') return 'PLAYER4';
    return 'PLAYER3';
  };
  return [firstServer, opposingFirstServer, teammate(firstServer), teammate(opposingFirstServer)];
}

export function configureNextDoublesSet(
  state: TennisMatchState,
  firstServer: PlayerId
): TennisMatchState {
  const pending = state.pendingDoublesServerSelection;
  if (!pending || !pending.players.includes(firstServer)) {
    throw new Error('Selected server is not eligible for the next set');
  }
  const opposingFirstServer = state.doublesServeOrder.find(
    player => getTeamForPlayer(state, player) !== pending.team
  );
  if (!opposingFirstServer) {
    throw new Error('Existing doubles service order is incomplete');
  }
  return {
    ...state,
    server: firstServer,
    currentSetFirstServer: firstServer,
    doublesServeOrder: getDoublesServiceOrder(firstServer, opposingFirstServer),
    doublesServeIndex: 0,
    pendingDoublesServerSelection: null,
    tiebreakFirstServer: null,
    tiebreakServeCount: 0,
  };
}


const teamToPlayer = (
  team: TeamId
): PlayerId => {
  return team === 'TEAM1'
    ? 'PLAYER1'
    : 'PLAYER3';
};

const pointWonByTeam = (
  state: TennisMatchState,
  team: TeamId
): TennisMatchState =>
  pointWon(
    state,
    teamToPlayer(team)
  );

const resetGameState = (
  state: TennisMatchState
): void => {
  state.player1Points = 0;
  state.player2Points = 0;
  state.serveNumber = 1;
};

// NORMAL GAME

export function checkGameWin(
  player1Points: number,
  player2Points: number
): PlayerId | null {
  if (
    player1Points >= 4 &&
    player1Points - player2Points >= 2
  ) {
    return 'PLAYER1';
  }

  if (
    player2Points >= 4 &&
    player2Points - player1Points >= 2
  ) {
    return 'PLAYER2';
  }

  return null;
}

// TIEBREAK

export function checkTiebreakWin(
  player1Points: number,
  player2Points: number
): PlayerId | null {
  if (
    player1Points >= 7 &&
    player1Points - player2Points >= 2
  ) {
    return 'PLAYER1';
  }

  if (
    player2Points >= 7 &&
    player2Points - player1Points >= 2
  ) {
    return 'PLAYER2';
  }

  return null;
}


export function getServerForTiebreak(
  firstServer: PlayerId,
  pointsPlayed: number,
  serviceOrder?: PlayerId[]
): PlayerId {

  const order =
    serviceOrder && serviceOrder.length > 1
      ? serviceOrder
      : [
          firstServer,
          otherPlayer(firstServer),
        ];

  const firstIndex =
    order.indexOf(firstServer);

  if (firstIndex === -1) {
    return firstServer;
  }

 
  const rotatedOrder = [
    ...order.slice(firstIndex),
    ...order.slice(0, firstIndex),
  ];

  
  const serverIndex =
    pointsPlayed === 0
      ? 0
      : 1 +
        Math.floor(
          (pointsPlayed - 1) / 2
        );

  return (
    rotatedOrder[
      serverIndex % rotatedOrder.length
    ] ?? firstServer
  );
}

export function checkSetWin(
  player1Games: number,
  player2Games: number
): PlayerId | 'TIEBREAK' | null {
  if (
    player1Games >= 6 &&
    player1Games - player2Games >= 2
  ) {
    return 'PLAYER1';
  }

  if (
    player2Games >= 6 &&
    player2Games - player1Games >= 2
  ) {
    return 'PLAYER2';
  }

  if (
    player1Games === 6 &&
    player2Games === 6
  ) {
    return 'TIEBREAK';
  }

  return null;
}


export function checkMatchWin(
  player1Sets: number,
  player2Sets: number,
  format: 'BEST_OF_3' | 'BEST_OF_5'
): PlayerId | null {
  const setsNeeded =
    format === 'BEST_OF_3'
      ? 2
      : 3;

  if (player1Sets >= setsNeeded) {
    return 'PLAYER1';
  }

  if (player2Sets >= setsNeeded) {
    return 'PLAYER2';
  }

  return null;
}

// POINT FUNCTION

export function pointWon(
  state: TennisMatchState,
  winner: PlayerId
): TennisMatchState {
  if (state.matchWinner) {
    return state;
  }

  const snapshot: TennisMatchState = {
    ...state,
    history: [],
  };

  const next: TennisMatchState = {
    ...state,
    history: [
      snapshot,
      ...state.history,
    ],
  };

  if (next.isTiebreak) {
    return handleTiebreakPoint(
      next,
      winner
    );
  }

  return handleNormalPoint(
    next,
    winner
  );
}

// NORMAL POINT

function handleNormalPoint(
  state: TennisMatchState,
  winner: PlayerId
): TennisMatchState {

  const next = state;

  const winningTeam =
    getTeamForPlayer(
      next,
      winner
    );

  if (winningTeam === 'TEAM1') {
    next.player1Points += 1;
  } else {
    next.player2Points += 1;
  }

  const gameWinner =
    checkGameWin(
      next.player1Points,
      next.player2Points
    );

  if (gameWinner) {
    return finishGame(
      next,
      gameWinner
    );
  }

  return next;
}

// TIEBREAK POINT

function handleTiebreakPoint(
  state: TennisMatchState,
  winner: PlayerId
): TennisMatchState {

  const next = state;

  const firstServer =
    next.tiebreakFirstServer ??
    next.server;


   // Award point to the correct team.
   
  const winningTeam =
    getTeamForPlayer(
      next,
      winner
    );

  if (winningTeam === 'TEAM1') {
    next.tiebreakPlayer1Points += 1;
  } else {
    next.tiebreakPlayer2Points += 1;
  }

  const totalPoints =
    next.tiebreakPlayer1Points +
    next.tiebreakPlayer2Points;

  
    // Check tiebreak winner.
   
  const tiebreakWinner =
    checkTiebreakWin(
      next.tiebreakPlayer1Points,
      next.tiebreakPlayer2Points
    );

   //Tiebreak finished.
   
  if (tiebreakWinner) {

    if (tiebreakWinner === 'PLAYER1') {
      next.player1Games += 1;
    } else {
      next.player2Games += 1;
    }

    return finishSet(
      next,
      tiebreakWinner,
      true
    );
  }

  next.server =
    getServerForTiebreak(
      firstServer,
      totalPoints,
      next.matchType === 'DOUBLES'
        ? next.doublesServeOrder
        : undefined
    );

  next.tiebreakServeCount =
    totalPoints;

  return next;
}

//   GAME FINISHED

function finishGame(
  state: TennisMatchState,
  winner: PlayerId
): TennisMatchState {
 const next = state;

  if (winner === 'PLAYER1') {
    next.player1Games += 1;
  } else {
    next.player2Games += 1;
  }
  resetGameState(next);
  
   // DOUBLES SERVER ROTATION
   
  if (
    next.matchType === 'DOUBLES' &&
    next.doublesServeOrder.length === 4
  ) {
    const nextIndex =
      (
        next.doublesServeIndex + 1
      ) %
      next.doublesServeOrder.length;

    next.doublesServeIndex =
      nextIndex;

    next.server =
      next.doublesServeOrder[
        nextIndex
      ];
  } else {
    
     // SINGLES SERVER ROTATION
     
    next.server =
      otherPlayer(
        next.server
      );
  }

  const setResult =
    checkSetWin(
      next.player1Games,
      next.player2Games
    );

  
   // 6-6 → TIEBREAK
   

  if (setResult === 'TIEBREAK') {
    next.isTiebreak = true;

    resetTiebreakState(next);

    next.serveNumber = 1;

    next.tiebreakFirstServer =
  next.server;
  }

  
   // NORMAL SET FINISHED
   

  else if (setResult) {
    return finishSet(
      next,
      setResult,
      false
    );
  }

  return next;
}

const resetTiebreakState = (
  state: TennisMatchState
): void => {
  state.tiebreakPlayer1Points = 0;
  state.tiebreakPlayer2Points = 0;
  state.tiebreakServeCount = 0;
  state.tiebreakFirstServer = null;
};

//SET FINISHED

function finishSet(
  state: TennisMatchState,
  winner: PlayerId,
  wasTiebreak: boolean
): TennisMatchState {
 const next = state;
  const setFirstServer = next.currentSetFirstServer;
  const setServiceOrder = [...next.doublesServeOrder];
  const setServeIndex = next.doublesServeIndex;
  const tiebreakFirstServer = next.tiebreakFirstServer;

  next.completedSets = [
    ...next.completedSets,
    {
      player1Games:
        next.player1Games,

      player2Games:
        next.player2Games,

      wasTiebreak,

      tiebreakPlayer1Points:
        wasTiebreak
          ? next.tiebreakPlayer1Points
          : undefined,

      tiebreakPlayer2Points:
        wasTiebreak
          ? next.tiebreakPlayer2Points
          : undefined,

      servingState: {
        version: 1,
        match_type: next.matchType,
        first_server: setFirstServer,
        // Completed-set metadata records the set-opening serving context.
        // The live state continues to track the post-game server below.
        current_server: setFirstServer,
        current_set_first_server: setFirstServer,
        current_set_service_order: setServiceOrder,
        doubles_serve_index: next.matchType === 'DOUBLES' ? 0 : setServeIndex,
        tiebreak_first_server: wasTiebreak ? tiebreakFirstServer : null,
        is_tiebreak: wasTiebreak,
      },
    },
  ];

  if (winner === 'PLAYER1') {
    next.player1Sets += 1;
  } else {
    next.player2Sets += 1;
  }

  const matchWinner =
    checkMatchWin(
      next.player1Sets,
      next.player2Sets,
      next.matchFormat
    );

  if (matchWinner) {
    next.matchWinner =
      matchWinner;
  }

  const nextSetServer = wasTiebreak &&
    next.matchType === 'SINGLES' &&
    tiebreakFirstServer
      ? otherPlayer(tiebreakFirstServer)
      : next.server;

  next.player1Games = 0;
  next.player2Games = 0;

  resetGameState(next);
  next.isTiebreak = false;

  resetTiebreakState(next);

  // Keep the authoritative post-tiebreak serving state even when this set
  // decides the match. The final point event already captured the pre-point
  // server; only the in-memory state advances to the next-set receiver.
  if (next.matchType === 'SINGLES') {
    next.server = nextSetServer;
    next.currentSetFirstServer = nextSetServer;
    next.doublesServeOrder = [
      nextSetServer,
      otherPlayer(nextSetServer),
    ];
    next.doublesServeIndex = 0;
  }

  if (next.matchWinner) return next;

  if (next.matchType === 'DOUBLES') {
    const servingTeam = wasTiebreak && tiebreakFirstServer
      ? getOpposingTeam(next, tiebreakFirstServer)
      : getTeamForPlayer(next, nextSetServer);
    next.pendingDoublesServerSelection = {
      team: servingTeam,
      players: servingTeam === 'TEAM1'
        ? ['PLAYER1', 'PLAYER2']
        : ['PLAYER3', 'PLAYER4'],
    };
    next.currentSetFirstServer = nextSetServer;
  } else {
    next.server = nextSetServer;
    next.currentSetFirstServer = nextSetServer;
  }

  return next;
}

  // DISPLAY POINTS

export function getDisplayPoints(
  player1Points: number,
  player2Points: number
): {
  player1Display: string;
  player2Display: string;
} {
  const pointNames = [
    '0',
    '15',
    '30',
    '40',
  ];

  if (
    player1Points < 3 ||
    player2Points < 3
  ) {
    return {
      player1Display:
        player1Points >= 3
          ? '40'
          : pointNames[
              player1Points
            ],

      player2Display:
        player2Points >= 3
          ? '40'
          : pointNames[
              player2Points
            ],
    };
  }

  if (
    player1Points ===
    player2Points
  ) {
    return {
      player1Display: '40',
      player2Display: '40',
    };
  }

  if (
    player1Points >
    player2Points
  ) {
    return {
      player1Display: 'AD',
      player2Display: '40',
    };
  }

  return {
    player1Display: '40',
    player2Display: 'AD',
  };
}


   //MATCH ACTIONS
   
const recordPointAction = (
  state: TennisMatchState,
  action: TennisEventType,
  player: PlayerId
): TennisMatchState => {
  const next =
    pointWon(
      state,
      player
    );

  return {
    ...next,

    serveNumber: 1,

    lastAction: {
      type: action,
      player,
    },
  };
};

const recordOpposingPointAction = (
  state: TennisMatchState,
  action: TennisEventType,
  player: PlayerId
): TennisMatchState => {
  const opposingTeam =
    getOpposingTeam(
      state,
      player
    );

  const next =
    pointWonByTeam(
      state,
      opposingTeam
    );

  return {
    ...next,

    serveNumber: 1,

    lastAction: {
      type: action,
      player,
    },
  };
};

const recordNonScoringAction = (
  state: TennisMatchState,
  action: TennisEventType,
  player: PlayerId,
  changes: Partial<TennisMatchState> = {}
): TennisMatchState => {
  const snapshot: TennisMatchState = {
    ...state,
    history: [],
  };

  return {
    ...state,
    ...changes,

    lastAction: {
      type: action,
      player,
    },

    history: [
      snapshot,
      ...state.history,
    ],
  };
};

export function recordAction(
  state: TennisMatchState,
  action: TennisEventType,
  player: PlayerId
): TennisMatchState {
  if (state.matchWinner) {
    return state;
  }

  switch (action) {
    case 'ACE':
    case 'WINNER':
    case 'VOLLEY':
    case 'POINT':
      return recordPointAction(
        state,
        action,
        player
      );

    case 'UNFORCED_ERROR':
      return recordOpposingPointAction(
        state,
        action,
        player
      );

   case 'DOUBLE_FAULT':
      return recordOpposingPointAction(
        state,
        'DOUBLE_FAULT',
        player
      );

    case 'FAULT':
      if (state.serveNumber === 2) {
          return recordOpposingPointAction(
          state,
        'DOUBLE_FAULT',
        player
      );
    }

      return recordNonScoringAction(
        state,
        'FAULT',
        player,
        {
          serveNumber: 2,
        }
      );

    case 'SERVE':
      return recordNonScoringAction(
        state,
        'SERVE',
        player
      );

    default:
      return state;
  }
}
