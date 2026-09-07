import { useRouter } from 'expo-router';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import matchDraftService from '@/services/match/match-draft.service';
import matchFinalizationService from '@/services/match/match-finalization.service';

import {
  Alert,
  Platform,
  View,
  useWindowDimensions,
} from 'react-native';

import MatchBoard from '@/components/tennis-match/MatchBoard';
import { useTennisMatch } from '@/components/tennis-match/hooks/useTennisMatch';
import { useTennisMatchParams } from '@/components/tennis-match/hooks/useTennisMatchParams';
import { getDisplayPoints } from '@/components/tennis-match/logic/tennisLogic';
import { PlayerId } from '@/components/tennis-match/types/tennis.types';
import { useFullscreenStore } from '@/stores/fullscreen.store';
import { useTheme } from '@/theme/themeContext';
import TennisHeader from '@/components/tennis-match/header/TennisHeader';
import { useMatchTimer } from '@/components/tennis-match/hooks/useMatchTimer';

export default function TennisMatchScreenView() {

  const theme = useTheme();
  const router = useRouter();

  const {
    matchId,
    player1Name,
    player2Name,
    player3Name,
    player4Name,
    matchType,
    matchFormat,
    matchNo,
    courtNo,
    doublesServeOrder,
    team1DisplayName,
    team2DisplayName,
  } = useTennisMatchParams();

  const {
    height: windowHeight,
  } = useWindowDimensions();

  const {
    status: timerStatus,
    elapsedSeconds,

    start: startTimer,
    pause: pauseTimer,
    stop: stopTimer,
    reset: resetTimer,
    restoreTimer,

  } = useMatchTimer();

  const {
    state,
    addPoint,
    recordMatchAction,
    events,
    undo,
    restoreMatch,
    resetMatch,
    canUndo,

  } = useTennisMatch(
    team1DisplayName,
    team2DisplayName,
    matchFormat,
    'PLAYER1',
    matchType,
    player3Name,
    player4Name,
    doublesServeOrder
  );

  // ACTION PLAYER
  
  const [
    selectedPlayer,
    setSelectedPlayer,
  ] = useState<PlayerId>('PLAYER1');

  const hasLoadedDraftRef = useRef(false);

  const [
    isDraftReady,
    setIsDraftReady,
  ] = useState(false);

  const [
  isFinalizing,
  setIsFinalizing,
] = useState(false);

const isFinalizationInProgressRef =
  useRef(false);

  useEffect(() => {
  if (hasLoadedDraftRef.current) {
    return;
  }

  hasLoadedDraftRef.current = true;

  const loadMatchDraft = async () => {
    try {
      if (!matchId) {
        return;
      }

      const draft =
        await matchDraftService.loadDraft(matchId);

      if (!draft) {
        return;
      }

      restoreMatch(
        draft.state,
        draft.events
      );

      restoreTimer(
        draft.elapsedSeconds,
        draft.timerStatus,
        draft.updatedAt
      );
    } catch (error) {
      console.error(
        'Failed to restore local match draft:',
        error
      );
    } finally {
      setIsDraftReady(true);
    }
  };

  void loadMatchDraft();
}, [
  matchId,
  restoreMatch,
  restoreTimer,
]);

useEffect(() => {
  if (!matchId || !isDraftReady) {
    return;
  }

  const saveTimeout = setTimeout(() => {
    void matchDraftService
      .saveDraft({
        matchId,
        state,
        events,
        elapsedSeconds,
        timerStatus,
      })
      .catch(error => {
        console.error(
          'Failed to save local match draft:',
          error
        );
      });
  }, 300);

  return () => {
    clearTimeout(saveTimeout);
  };
}, [
  matchId,
  isDraftReady,
  state,
  events,
  elapsedSeconds,
  timerStatus,
]);
const finalizeMatch = useCallback(async () => {
  if (!matchId) {
    Alert.alert(
      'Cannot Save Match',
      'Match ID is missing.'
    );
    return;
  }

  if (!state.matchWinner) {
    Alert.alert(
      'Cannot Save Match',
      'Declare a match winner first.'
    );
    return;
  }

  if (events.length === 0) {
    Alert.alert(
      'Cannot Save Match',
      'No match events were recorded.'
    );
    return;
  }

  if (isFinalizationInProgressRef.current) {
    return;
  }

  isFinalizationInProgressRef.current = true;

  setIsFinalizing(true);

  try {
    // Events are shown newest first in the UI.
    // Backend requires oldest event first.
    const chronologicalEvents =
      [...events].reverse();

    await matchFinalizationService.finalize(
      matchId,
      {
        final_state: {
          player1_points: state.player1Points,
          player2_points: state.player2Points,

          player1_games: state.player1Games,
          player2_games: state.player2Games,

          player1_sets: state.player1Sets,
          player2_sets: state.player2Sets,

          is_tiebreak: state.isTiebreak,

          tiebreak_player1_points:
            state.tiebreakPlayer1Points,

          tiebreak_player2_points:
            state.tiebreakPlayer2Points,

          match_winner:
            state.matchWinner === 'PLAYER1'
              ? 'PLAYER1'
              : 'PLAYER2',

          completed_sets:
            state.completedSets.map(set => ({
              player1_games:
                set.player1Games,

              player2_games:
                set.player2Games,

              was_tiebreak:
                set.wasTiebreak,

              tiebreak_player1_points:
                set.tiebreakPlayer1Points,

              tiebreak_player2_points:
                set.tiebreakPlayer2Points,
            })),
        },

        events: chronologicalEvents.map(
          (event, index) => ({
            event_number: index + 1,

            event_type: event.type,

            player: event.player,

            elapsed_seconds:
              event.elapsedSeconds,

            recorded_at: new Date(
              event.recordedAt
            ).toISOString(),
          })
        ),
      }
    );

    // Remove local copies only after the backend
    // confirms that the full match was saved.
    await matchDraftService.deleteDraft(matchId);

    stopTimer();

    Alert.alert(
      'Match Saved',
      'The completed match was saved successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/matches');
          },
        },
      ]
    );
  } catch (error: any) {
    console.error(
      'Failed to finalize match:',
      error
    );

    const message =
      error?.response?.data?.message ??
      error?.response?.data?.detail ??
      'Match was not saved. Your local draft is safe; please try again.';

    Alert.alert(
      'Unable to Save Match',
      typeof message === 'string'
        ? message
        : 'Match was not saved. Your local draft is safe; please try again.'
    );
  } finally {
    isFinalizationInProgressRef.current = false;
    setIsFinalizing(false);
  }
}, [
  matchId,
  state,
  events,
  stopTimer,
  router,
]);
    // FULLSCREEN STORE
 
  const {
    setFullscreen,
  } = useFullscreenStore();

  // BROWSER FULLSCREEN STATE
  
  const [
    isBrowserFullscreen,
    setIsBrowserFullscreen,
  ] = useState(false);


  const syncBrowserFullscreen =
    useCallback(() => {
      if (
        Platform.OS !== 'web' ||
        typeof document === 'undefined'
      ) {
        setIsBrowserFullscreen(false);
        return;
      }
      setIsBrowserFullscreen(
        Boolean(document.fullscreenElement)
      );
    }, []);

  const enterBrowserFullscreen =
  useCallback(async () => {
    if (
      Platform.OS !== 'web' ||
      typeof document === 'undefined'
    ) {
      return;
    }

    if (document.fullscreenElement) {
      syncBrowserFullscreen();
      return;
    }

    try {
      const element = document.documentElement;

      if (element.requestFullscreen) {
        await element.requestFullscreen({
          navigationUI: 'hide',
        });
      }
    } catch (error) {
      console.error(
        'Browser fullscreen failed:',
        error
      );
    } finally {
      syncBrowserFullscreen();
    }
  }, [
    syncBrowserFullscreen,
  ]);

  const exitBrowserFullscreen =
    useCallback(async () => {
      if (
        Platform.OS !== 'web' ||
        typeof document === 'undefined'
      ) {
        return;
      }
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch {
        // Fullscreen may already be exited.
      } finally {

        syncBrowserFullscreen();
      }
    }, [
      syncBrowserFullscreen,
    ]);

  const toggleBrowserFullscreen =
    useCallback(() => {
      if (isBrowserFullscreen) {
        void exitBrowserFullscreen();
      } else {
        void enterBrowserFullscreen();
      }
    }, [
      enterBrowserFullscreen,
      exitBrowserFullscreen,
      isBrowserFullscreen,
    ]);
 
    // RESTART MATCH
  const restartCurrentMatch =
    useCallback(() => {
      resetMatch();
      resetTimer();
      setSelectedPlayer('PLAYER1');
    }, [
      resetMatch,
      resetTimer,
    ]);

    // RESET MATCH 

  const resetCurrentMatch =
    useCallback(() => {
      resetMatch();
      resetTimer();
      setSelectedPlayer('PLAYER1');
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/matches');
      }
    }, [
      resetMatch,
      resetTimer,
      router,
    ]);

  useEffect(() => {
    syncBrowserFullscreen();
    if (
      Platform.OS !== 'web' ||
      typeof document === 'undefined'
    ) {
      return;
    }
    document.addEventListener(
      'fullscreenchange',
      syncBrowserFullscreen
    );
    return () => {
      document.removeEventListener(
        'fullscreenchange',
        syncBrowserFullscreen
      );
    };
  }, [
    syncBrowserFullscreen,
  ]);

  useEffect(() => {
    return () => {
      if (
        Platform.OS === 'web' &&
        typeof document !== 'undefined' &&
        document.fullscreenElement
      ) {
        void document
          .exitFullscreen()
          .catch(() => undefined);
      }
    };
  }, []);

  // STOP TIMER WHEN MATCH IS COMPLETED
 
  useEffect(() => {
    if (
      state.matchWinner &&
      timerStatus === 'running'
    ) {
      stopTimer();
    }
  }, [
    state.matchWinner,
    timerStatus,
    stopTimer,
  ]);
  
  useEffect(() => {
    setFullscreen(true);
    return () => {
      setFullscreen(false);
    };
  }, [
    setFullscreen,
  ]);

  // SCORE DISPLAY
  
  const {
    player1Display,
    player2Display,
  } = getDisplayPoints(
    state.player1Points,
    state.player2Points
  );

  const p1Point = state.isTiebreak
    ? String(state.tiebreakPlayer1Points)
    : player1Display;

  const p2Point = state.isTiebreak
    ? String(state.tiebreakPlayer2Points)
    : player2Display;
  
    // SCORING ENABLED
  
  const scoringEnabled =
    timerStatus === 'running' &&
    !Boolean(state.matchWinner);

  // MATCH STATUS

  const matchStatus = state.matchWinner
    ? 'Completed'
    : state.isTiebreak
      ? 'Tiebreak'
      : 'In Progress';

  return (
    <View
      style={{
        height: windowHeight,
        backgroundColor:
          theme.colors.background,
        overflow: 'hidden',
        padding: 8,
      }}
    >

      <TennisHeader
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/matches');
          }
        }}

        matchCompleted={
          Boolean(state.matchWinner)
        }
        courtName={`Court ${courtNo}`}
        elapsedSeconds={
          elapsedSeconds
        }
        timerStatus={
          timerStatus
        }
        onStart={() => {
          startTimer();
          void enterBrowserFullscreen();
        }}
        onPause={
          pauseTimer
        }
        onStop={
          stopTimer
        }
        matchNo={
          matchNo
        }
        isFullscreen={
          isBrowserFullscreen
        }
        onRestartMatch={
          restartCurrentMatch
        }
        onResetMatch={
          resetCurrentMatch
        }
        onToggleFullscreen={
          toggleBrowserFullscreen
        }
      />
      
      <View
        style={{
          flex: 1,
          minHeight: 0,
          borderWidth: 1,
          borderColor:
            theme.colors.border,
          borderTopWidth: 0,
          borderBottomLeftRadius:
            theme.radius.md,
          borderBottomRightRadius:
            theme.radius.md,
          backgroundColor:
            theme.colors.surface,
        }}
      >
        <MatchBoard
          state={state}
          matchType={matchType}
          matchFormat={matchFormat}
          player1Name={player1Name}
          player2Name={player2Name}
          player3Name={player3Name}
          player4Name={player4Name}
          team1DisplayName={
            team1DisplayName
          }

          team2DisplayName={
            team2DisplayName
          }

          p1Point={
            p1Point
          }

          p2Point={
            p2Point
          }

          matchStatus={
            matchStatus
          }

          selectedPlayer={
            selectedPlayer
          }

          onPlayerChange={
            setSelectedPlayer
          }

          onAddPoint={(player) =>
            addPoint(
              player,
              elapsedSeconds
            )
          }

          onMatchAction={(
            action,
            player
          ) =>
            recordMatchAction(
              action,
              player,
              elapsedSeconds
            )
          }

          onUndo={
            undo
          }
          canUndo={
            canUndo
          }
          scoringEnabled={
              scoringEnabled
            }

            onFinalizeMatch={
              finalizeMatch
            }

            isFinalizing={
              isFinalizing
            }

            recentEvents={
              events
            }
        />
      </View>
    </View>
  );
}