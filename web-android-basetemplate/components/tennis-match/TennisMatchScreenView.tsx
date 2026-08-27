import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
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

  } = useMatchTimer();

  const {
    state,
    addPoint,
    recordMatchAction,
    events,
    undo,
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
          recentEvents={
            events
          }
        />
      </View>
    </View>
  );
}