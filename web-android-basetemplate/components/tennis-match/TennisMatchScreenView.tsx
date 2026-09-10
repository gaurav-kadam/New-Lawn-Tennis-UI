import { useRouter } from 'expo-router';
import { useNavigation, usePreventRemove } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import NotificationModal from '@/components/ui/NotificationModal';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import matchDraftService from '@/services/match/match-draft.service';
import matchFinalizationService from '@/services/match/match-finalization.service';
import { loadMatchResult } from '@/services/match/match-result.service';
import { serializeCompletedSetServingState } from '@/services/match/completed-set-serving-state';

import {
  ActivityIndicator,
  Pressable,
  Text,
  Platform,
  View,
  useWindowDimensions,
} from 'react-native';

import MatchBoard from '@/components/tennis-match/MatchBoard';
import { useTennisMatch } from '@/components/tennis-match/hooks/useTennisMatch';
import { TennisMatchParams, useTennisMatchParams } from '@/components/tennis-match/hooks/useTennisMatchParams';
import { getDisplayPoints } from '@/components/tennis-match/logic/tennisLogic';
import { PlayerId } from '@/components/tennis-match/types/tennis.types';
import { useFullscreenStore } from '@/stores/fullscreen.store';
import { useTheme } from '@/theme/themeContext';
import TennisHeader from '@/components/tennis-match/header/TennisHeader';
import { useMatchTimer } from '@/components/tennis-match/hooks/useMatchTimer';

export default function TennisMatchScreenView() {
  const params = useTennisMatchParams();
  return <TennisMatchSession key={params.matchId} params={params} />;
}

function TennisMatchSession({ params }: { params: TennisMatchParams }) {

  const [completedParams, setCompletedParams] = useState<TennisMatchParams | null>(null);
  const readOnly = completedParams !== null;
  const theme = useTheme();
  const router = useRouter();
  const navigation = useNavigation();

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
    servingState,
    team1DisplayName,
    team2DisplayName,
  } = completedParams ?? params;

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
    selectNextSetServer,
    applyServingState,
    canUndo,

  } = useTennisMatch(
    team1DisplayName,
    team2DisplayName,
    matchFormat,
    'PLAYER1',
    matchType,
    player3Name,
    player4Name,
    doublesServeOrder,
    servingState
  );

  // ACTION PLAYER
  
  const [
    selectedPlayer,
    setSelectedPlayer,
  ] = useState<PlayerId>('PLAYER1');

  const [draftStatus, setDraftStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [draftError, setDraftError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const isFinalizationInProgressRef = useRef(false);
  const acceptedRef = useRef(false);
  const uncertainRef = useRef(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
  usePreventRemove(isFinalizing, ({ data }) => {
    if (!isFinalizationInProgressRef.current) {
      navigation.dispatch(data.action);
      return;
    }
    setNotification({ type: 'error', title: 'Saving Match', message: 'Please wait until the current match operation finishes.' });
  });
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setDraftStatus('loading');
    setDraftError('');
    void (async () => {
      try {
        if (!matchId) throw new Error('Match ID is missing. Return to Matches to open a match.');
        // Verify server status before touching drafts, including direct links/reloads.
        const result = await loadMatchResult(matchId);
        if (!active) return;
        if (result.completed) {
          acceptedRef.current = true;
          setCompletedParams(result.params);
          restoreMatch(result.state, result.events);
          restoreTimer(result.elapsedSeconds, 'stopped', Date.now());
          setDraftStatus('ready');
          return;
        }
        const draft = await matchDraftService.loadDraft(matchId);
        if (!active) return;
        if (draft) {
          restoreMatch(draft.state, draft.events);
          restoreTimer(draft.elapsedSeconds, draft.timerStatus, draft.updatedAt);
        } else if (result.servingState) {
          applyServingState(result.servingState);
        }
        setDraftStatus('ready');
      } catch (error) {
        if (!active) return;
        setDraftError(isAxiosError(error) ? 'Unable to verify the saved match. Please check your connection and retry.' : error instanceof Error ? error.message : 'Unable to restore the match. Please retry.');
        setDraftStatus('failed');
      }
    })();
    return () => { active = false; };
  }, [matchId, loadAttempt, restoreMatch, restoreTimer, applyServingState]);

  useEffect(() => {
    if (!matchId || draftStatus !== 'ready' || readOnly || acceptedRef.current || isFinalizationInProgressRef.current) return;
    // Enqueue every committed snapshot immediately, including reset/restart.
    // Navigation cannot cancel a delayed debounce and lose the last point.
    void matchDraftService.saveDraft({
      matchId, state, events, elapsedSeconds, timerStatus,
    }).catch(() => {
      if (mountedRef.current) setDraftError('Local save failed. Keep this match open and retry saving.');
    });
  }, [matchId, draftStatus, readOnly, state, events, elapsedSeconds, timerStatus]);

  const canMutate = useCallback(() => !readOnly && draftStatus === 'ready' && !isFinalizationInProgressRef.current && !acceptedRef.current && !uncertainRef.current, [draftStatus, readOnly]);

const finalizeMatch = useCallback(async () => {
  if (!canMutate()) return;
  if (!matchId || !state.matchWinner || events.length === 0) {
    setNotification({ type: 'error', title: 'Cannot Save Match', message: 'A completed match and its recorded events are required.' });
    return;
  }

  isFinalizationInProgressRef.current = true;

  setIsFinalizing(true);
  let submitted = false;

  try {
    await matchDraftService.saveDraft({ matchId, state, events, elapsedSeconds, timerStatus });
    // Events are shown newest first in the UI.
    // Backend requires oldest event first.
    const chronologicalEvents =
      [...events].reverse();
    const matchFirstServer =
      state.completedSets[0]?.servingState?.first_server ??
      servingState?.first_server ??
      'PLAYER1';

    submitted = true;
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

              serving_state:
                set.servingState
                  ? serializeCompletedSetServingState(
                    set.servingState,
                    state.matchType
                  )
                  : undefined,
            })),

          serving_state: {
            version: 1,
            match_type: state.matchType,
            first_server: matchFirstServer,
            current_server: state.server,
            current_set_first_server: state.currentSetFirstServer,
            current_set_service_order: state.doublesServeOrder,
            doubles_serve_index: state.doublesServeIndex,
            tiebreak_first_server: state.tiebreakFirstServer,
            is_tiebreak: state.isTiebreak,
          },
        },

        events: chronologicalEvents.map(
          (event, index) => ({
            event_number: index + 1,

            event_type: event.type,

            player: event.player,

            server: event.server,

            elapsed_seconds:
              event.elapsedSeconds,

            recorded_at: new Date(
              event.recordedAt
            ).toISOString(),
          })
        ),
      }
    );

    acceptedRef.current = true;
    let cleanupFailed = false;
    try { await matchDraftService.deleteDraft(matchId); }
    catch { cleanupFailed = true; }
    if (mountedRef.current) {
      stopTimer();
      setNotification({
        type: 'success', title: 'Match Saved',
        message: cleanupFailed
          ? 'The match was saved successfully. Local draft cleanup failed; the saved server result will be used when you reopen it.'
          : 'The completed match was saved successfully.',
      });
    }
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    const uncertain = submitted && (status === undefined || status >= 500 || status === 409);
    uncertainRef.current = uncertain;
    if (mountedRef.current) setNotification({
      type: 'error',
      title: uncertain ? 'Check Match Result' : 'Unable to Save Match',
      message: uncertain
        ? 'The server result could not be confirmed, or the match is already completed. Your draft has been kept. Return to Matches and reopen this match to check its saved result.'
        : submitted
          ? 'The server did not accept the match. Your draft has been kept.'
          : 'The latest draft could not be saved locally. No finalization request was sent. Please retry.',
    });
  } finally {
    isFinalizationInProgressRef.current = false;
    if (mountedRef.current) setIsFinalizing(false);
  }
}, [canMutate, matchId, state, events, elapsedSeconds, timerStatus, stopTimer, servingState?.first_server]);
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
      if (!canMutate()) return;
      resetMatch();
      resetTimer();
      setSelectedPlayer('PLAYER1');
      isFinalizationInProgressRef.current = false;
      setIsFinalizing(false);
    }, [
      canMutate,
      resetMatch,
      resetTimer,
    ]);

    // RESET MATCH 

  const resetCurrentMatch = useCallback(async () => {
    if (!canMutate()) return;
    isFinalizationInProgressRef.current = true;
    setIsFinalizing(true);
    try {
      await matchDraftService.deleteDraft(matchId);
      acceptedRef.current = true; // Block old snapshots during navigation.
      if (!mountedRef.current) return;
      resetMatch();
      resetTimer();
      setSelectedPlayer('PLAYER1');
      if (router.canGoBack()) router.back();
      else router.replace('/matches');
    } catch {
      if (mountedRef.current) setDraftError('Unable to reset the stored match. Your current session has been kept.');
    } finally {
      isFinalizationInProgressRef.current = false;
      if (mountedRef.current) setIsFinalizing(false);
    }
  }, [canMutate, matchId, resetMatch, resetTimer, router]);

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
    canMutate() && timerStatus === 'running' &&
    !Boolean(state.matchWinner) &&
    !state.pendingDoublesServerSelection;

  const playerNameForId = (player: PlayerId) => {
    if (player === 'PLAYER1') return player1Name;
    if (player === 'PLAYER2') return matchType === 'DOUBLES' ? player2Name : player2Name;
    if (player === 'PLAYER3') return player3Name;
    return player4Name;
  };

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

      <NotificationModal
        visible={notification !== null}
        type={notification?.type ?? 'error'}
        title={notification?.title ?? ''}
        message={notification?.message ?? ''}
        onClose={() => {
          const saved = acceptedRef.current;
          setNotification(null);
          if (saved) router.replace('/matches');
        }}
      />
      {draftStatus !== 'ready' && (
        <View style={{ padding: 12 }}>
          {draftStatus === 'loading' ? <ActivityIndicator /> : <>
            <Text>{draftError}</Text>
            <Pressable onPress={() => setLoadAttempt(value => value + 1)}><Text>Retry loading match</Text></Pressable>
          </>}
        </View>
      )}
      {readOnly && <Text>Completed match - read only</Text>}
      {draftStatus === 'ready' && draftError !== '' && <Text accessibilityRole="alert">{draftError}</Text>}
      <TennisHeader
        controlsDisabled={!canMutate()}
        onBack={() => {
          if (isFinalizationInProgressRef.current) return;
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
          if (!canMutate()) return;
          startTimer();
          void enterBrowserFullscreen();
        }}
        onPause={
          () => { if (canMutate()) pauseTimer(); }
        }
        onStop={
          () => { if (canMutate()) stopTimer(); }
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
        {state.pendingDoublesServerSelection && (
          <View
            style={{
              margin: 10,
              padding: 12,
              borderWidth: 1,
              borderColor: theme.colors.primary,
              borderRadius: 10,
              backgroundColor: theme.colors.background,
            }}
          >
            <Text style={{ color: theme.colors.textPrimary, fontWeight: '800', marginBottom: 8 }}>
              Select the first server for the new set
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {state.pendingDoublesServerSelection.players.map(player => (
                <Pressable
                  key={player}
                  onPress={() => selectNextSetServer(player)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: theme.colors.textPrimary, textAlign: 'center', fontWeight: '700' }}>
                    {playerNameForId(player)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

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
            scoringEnabled && addPoint(
              player,
              elapsedSeconds
            )
          }

          onMatchAction={(
            action,
            player
          ) =>
            scoringEnabled && recordMatchAction(
              action,
              player,
              elapsedSeconds
            )
          }

          onUndo={
            () => { if (scoringEnabled) undo(); }
          }
          canUndo={
            canUndo
          }
          scoringEnabled={
              scoringEnabled
            }

            onFinalizeMatch={
              readOnly || acceptedRef.current || uncertainRef.current ? undefined : finalizeMatch
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
