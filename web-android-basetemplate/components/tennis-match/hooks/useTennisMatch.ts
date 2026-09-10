import { useCallback, useRef, useState } from 'react';

import {
  MatchFormat,
  MatchType,
  PlayerId,
  TennisEventRecord,
  TennisEventType,
  TennisMatchState,
  ServingStateSnapshot,
} from '../types/tennis.types';

import {
  recordAction,
  configureNextDoublesSet,
} from '../logic/tennisLogic';

function createInitialState(
  player1Name: string,
  player2Name: string,
  matchFormat: MatchFormat,
  firstServer: PlayerId,
  matchType: MatchType = 'SINGLES',
  player3Name = '',
  player4Name = '',
  doublesServeOrder: PlayerId[] = [],
  servingState?: ServingStateSnapshot | null
): TennisMatchState {
  const normalizedServeOrder =
    servingState?.current_set_service_order ??
    (matchType === 'DOUBLES'
      ? doublesServeOrder
      : [
          firstServer,
          firstServer === 'PLAYER1'
            ? 'PLAYER2'
            : 'PLAYER1',
        ]);

  const initialServer =
    servingState?.current_server ??
    (matchType === 'DOUBLES' && normalizedServeOrder.length > 0
      ? normalizedServeOrder[0]
      : firstServer);

  return {
    matchType,
    matchFormat,

    player1Name,
    player2Name,
    player3Name,
    player4Name,

    server: initialServer,
    serveNumber: 1,

    doublesServeOrder: normalizedServeOrder,
    doublesServeIndex:
      servingState?.doubles_serve_index ?? 0,

    player1Points: 0,
    player2Points: 0,

    isTiebreak: false,
    tiebreakPlayer1Points: 0,
    tiebreakPlayer2Points: 0,
    tiebreakServeCount: 0,
    tiebreakFirstServer:
      servingState?.tiebreak_first_server ?? null,

    currentSetFirstServer:
      servingState?.current_set_first_server ?? initialServer,

    pendingDoublesServerSelection: null,

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
  player3Name = '',
  player4Name = '',
  doublesServeOrder: PlayerId[] = [],
  servingState?: ServingStateSnapshot | null
) {
  const [session, setSession] = useState(() => ({
    state: createInitialState(
      player1Name, player2Name, matchFormat, firstServer, matchType,
      player3Name, player4Name, doublesServeOrder, servingState
    ),
    events: [] as TennisEventRecord[],
  }));
  const eventSequenceRef = useRef(0);

  const recordMatchAction = useCallback((
    action: TennisEventType, player: PlayerId, elapsedSeconds: number
  ) => {
    // Metadata is created once, outside React's replayable transition.
    const recordedAt = Date.now();
    const id = `${recordedAt}-${eventSequenceRef.current++}`;
    const seconds = Math.max(0, Math.floor(elapsedSeconds));
    setSession(previous => {
      if (previous.state.matchWinner || previous.state.pendingDoublesServerSelection) return previous;
      const actor = action === 'ACE' || action === 'FAULT' ||
        action === 'DOUBLE_FAULT' || action === 'SERVE'
        ? previous.state.server : player;
      const next = recordAction(previous.state, action, actor);
      return {
        state: next,
        events: [{
          id, recordedAt, elapsedSeconds: seconds,
          type: next.lastAction?.type ?? action,
          player: actor,
          server: previous.state.server,
        }, ...previous.events],
      };
    });
  }, []);

  const addPoint = useCallback((winner: PlayerId, elapsedSeconds: number) => {
    recordMatchAction('POINT', winner, elapsedSeconds);
  }, [recordMatchAction]);

  const undo = useCallback(() => {
    setSession(previous => {
      const [state, ...history] = previous.state.history;
      if (!state) return previous;
      return { state: { ...state, history }, events: previous.events.slice(1) };
    });
  }, []);

  const selectNextSetServer = useCallback((player: PlayerId) => {
    setSession(previous => {
      if (previous.state.matchWinner || !previous.state.pendingDoublesServerSelection) {
        return previous;
      }
      return {
        ...previous,
        state: configureNextDoublesSet(previous.state, player),
      };
    });
  }, []);

  const applyServingState = useCallback((snapshot: ServingStateSnapshot) => {
    setSession(previous => {
      if (previous.events.length > 0 || previous.state.player1Points || previous.state.player2Points ||
        previous.state.player1Games || previous.state.player2Games || previous.state.player1Sets || previous.state.player2Sets) {
        return previous;
      }
      return {
        ...previous,
        state: {
          ...previous.state,
          server: snapshot.current_server,
          currentSetFirstServer: snapshot.current_set_first_server,
          doublesServeOrder: snapshot.current_set_service_order,
          doublesServeIndex: snapshot.doubles_serve_index,
          tiebreakFirstServer: snapshot.tiebreak_first_server,
          isTiebreak: snapshot.is_tiebreak,
          pendingDoublesServerSelection: null,
        },
      };
    });
  }, []);

  const resetMatch = () => {
    setSession({
      state: createInitialState(
        player1Name, player2Name, matchFormat, firstServer, matchType,
        player3Name, player4Name, doublesServeOrder, servingState
      ),
      events: [],
    });
    eventSequenceRef.current = 0;
  };

  const restoreMatch = useCallback((
    savedState: TennisMatchState, savedEvents: TennisEventRecord[]
  ) => {
    setSession({
      state: {
        ...savedState,
        history: savedState.history ?? [],
        currentSetFirstServer: savedState.currentSetFirstServer ?? savedState.server,
        pendingDoublesServerSelection: savedState.pendingDoublesServerSelection ?? null,
      },
      events: savedEvents,
    });
    eventSequenceRef.current = savedEvents.length;
  }, []);

  return {
    state: session.state,
    events: session.events,
    addPoint, recordMatchAction, undo, resetMatch, restoreMatch, selectNextSetServer, applyServingState,
    canUndo: session.state.history.length > 0,
  };
}
