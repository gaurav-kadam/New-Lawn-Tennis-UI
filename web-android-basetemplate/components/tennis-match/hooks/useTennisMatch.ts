import { useRef,useState } from 'react';

import {
  MatchFormat,
  MatchType,
  PlayerId,
  TennisEventType,
  TennisEventRecord,
  TennisMatchState,
} from '../../tennis-match/types/tennis.types';

import {
  pointWon,
  recordAction,
} from '../../tennis-match/logic/tennisLogic';


function createInitialState(
  player1Name: string,
  player2Name: string,
  matchFormat: MatchFormat,
  firstServer: PlayerId,
  matchType: MatchType = 'SINGLES',
  player3Name: string = '',
  player4Name: string = '',
  doublesServeOrder: PlayerId[] = []
): TennisMatchState {

  const normalizedServeOrder =
    matchType === 'DOUBLES'
      ? doublesServeOrder
      : [];

  const initialServer =
    matchType === 'DOUBLES' &&
    normalizedServeOrder.length > 0
      ? normalizedServeOrder[0]
      : firstServer;

  return {

    matchType,
    matchFormat,

    player1Name,
    player2Name,
    player3Name,
    player4Name,

    server: initialServer,
    serveNumber: 1,

    doublesServeOrder:
      normalizedServeOrder,

    doublesServeIndex:
      matchType === 'DOUBLES' &&
      normalizedServeOrder.length > 0
        ? 0
        : 0,

    player1Points: 0,
    player2Points: 0,

    isTiebreak: false,

    tiebreakPlayer1Points: 0,
    tiebreakPlayer2Points: 0,

    tiebreakServeCount: 0,

    tiebreakFirstServer: null,

    player1Games: 0,
    player2Games: 0,

    completedSets: [],

    player1Sets: 0,
    player2Sets: 0,

    matchWinner: null,

    lastAction: null,

    history: [],
  };
}


export function useTennisMatch(
  player1Name: string,
  player2Name: string,
  matchFormat: MatchFormat,

  firstServer: PlayerId = 'PLAYER1',

  matchType: MatchType = 'SINGLES',

  player3Name: string = '',

  player4Name: string = '',

  doublesServeOrder: PlayerId[] = []
) {

  const [state, setState] =
    useState<TennisMatchState>(() =>
      createInitialState(
        player1Name,
        player2Name,
        matchFormat,
        firstServer,
        matchType,
        player3Name,
        player4Name,
        doublesServeOrder
      )
    );

    const [events, setEvents] =
    useState<TennisEventRecord[]>([]);

    const eventSequenceRef = useRef(0);

    const createEvent = (
      type: TennisEventType,
      player: PlayerId,
      elapsedSeconds: number
    ): TennisEventRecord => ({
      id: `${Date.now()}-${eventSequenceRef.current++}`,
      type,
      player,
      elapsedSeconds: Math.max(
        0,
        Math.floor(elapsedSeconds)
      ),
      recordedAt: Date.now(),
    });

 const addPoint = (
  winner: PlayerId,
  elapsedSeconds: number
) => {
  if (state.matchWinner) {
    return;
  }

  const next = recordAction(
    state,
    'POINT',
    winner
  );

  setState(next);

  setEvents((previous) => [
    createEvent(
      next.lastAction?.type ?? 'POINT',
      winner,
      elapsedSeconds
    ),
    ...previous,
  ]);
};

const recordMatchAction = (
  action: TennisEventType,
  player: PlayerId,
  elapsedSeconds: number
) => {
  if (state.matchWinner) {
    return;
  }

  const next = recordAction(
    state,
    action,
    player
  );

  setState(next);

  setEvents((previous) => [
    createEvent(
      next.lastAction?.type ?? action,
      player,
      elapsedSeconds
    ),
    ...previous,
  ]);
};

  const undo = () => {

    if (state.history.length === 0) {
      return;
    }

    const [
      previous,
      ...remainingHistory
    ] = state.history;

    setState({
      ...previous,

      history:
        remainingHistory,
    });
    setEvents((previousEvents) =>
    previousEvents.slice(1))
  };


  const resetMatch = () => {

    setState(
      createInitialState(
        player1Name,
        player2Name,
        matchFormat,
        firstServer,
        matchType,
        player3Name,
        player4Name,
        doublesServeOrder
      )
    );
    setEvents([]);
    eventSequenceRef.current = 0;
  };

  return {
  state,
  addPoint,
  recordMatchAction,
  events,
  undo,
  resetMatch,
  canUndo:
    state.history.length > 0,
};
}