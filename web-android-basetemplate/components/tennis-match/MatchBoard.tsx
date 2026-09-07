import React from 'react';
import {
  View,
  useWindowDimensions,
} from 'react-native';

import TennisCourt from './court/TennisCourt';
import ActionPlayerSelector from './controls/ActionPlayerSelector';
import MatchWinnerBanner from './controls/MatchWinnerBanner';
import PointButtons from './controls/PointButtons';
import TennisToolbar from './controls/TennisToolbar';
import PlayerScorer from './header/PlayerScorer';

import RecentEvents from './events/RecentEvents';

import {
  MatchFormat,
  MatchType,
  PlayerId,
  TennisEventType,
  TennisEventRecord,
  TennisMatchState,
} from './types/tennis.types';

import { styles } from './MatchBoard.styles';

type Props = {
  state: TennisMatchState;

  matchType: MatchType;
  matchFormat: MatchFormat;

  recentEvents: TennisEventRecord[];

  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;

  team1DisplayName: string;
  team2DisplayName: string;

  p1Point: string;
  p2Point: string;

  matchStatus: string;

  selectedPlayer: PlayerId;
  onPlayerChange: (player: PlayerId) => void;

  onAddPoint: (player: PlayerId) => void;

  onMatchAction: (
    action: TennisEventType,
    player: PlayerId
  ) => void;

  onUndo: () => void;

  canUndo: boolean;
  scoringEnabled: boolean;

  onFinalizeMatch?: () => void;
  isFinalizing?: boolean;

};

export default function MatchBoard({
  state,
  matchType,
  matchFormat,

  player1Name,
  player2Name,
  player3Name,
  player4Name,

  team1DisplayName,
  team2DisplayName,

  p1Point,
  p2Point,

  matchStatus,

  selectedPlayer,
  onPlayerChange,

  onAddPoint,
  onMatchAction,

  onUndo,
  canUndo,
  scoringEnabled,

  onFinalizeMatch,
  isFinalizing,
  
  recentEvents
}: Props) {
  const { width } =
    useWindowDimensions();

  const showSideEvents =
    width >= 1050;

  const winnerName = state.matchWinner
    ? state.matchWinner === 'PLAYER1'
      ? team1DisplayName
      : team2DisplayName
    : null;

  return (
    <View style={styles.container}>

          {/* MATCH WINNER */}


      <MatchWinnerBanner
        winnerName={winnerName}
        onFinalize={onFinalizeMatch}
        isFinalizing={isFinalizing}
      />

          {/* SCOREBOARD */}
<View
  style={[
    styles.upperMatchArea,
    !showSideEvents &&
      styles.upperMatchAreaCompact,
  ]}
>
      {/* LEFT SIDE:
      SCOREBOARD + COURT */}

  <View style={styles.matchMainColumn}>
    {/* SCOREBOARD */}

    <PlayerScorer
      player1Name={team1DisplayName}
      player2Name={team2DisplayName}
      player3Name={player3Name}
      player4Name={player4Name}
      player1Games={state.player1Games}
      player2Games={state.player2Games}
      player1Points={p1Point}
      player2Points={p2Point}
      completedSets={state.completedSets}
      server={state.server}
      matchType={matchType}
      matchFormat={matchFormat}
    />

    {/* COURT */}

    <View style={styles.courtRow}>
      <View style={styles.courtContainer}>
        <TennisCourt />
      </View>
    </View>
  </View>

      {/* RIGHT SIDE:
      RECENT EVENTS */}

  <RecentEvents
    events={recentEvents}
    player1Name={player1Name}
    player2Name={player2Name}
    player3Name={player3Name}
    player4Name={player4Name}
    team1DisplayName={team1DisplayName}
    team2DisplayName={team2DisplayName}
    matchType={matchType}
    compact={!showSideEvents}
  />
</View>

      {/* 
          ACTION PLAYER
       */}

      <ActionPlayerSelector
        matchType={matchType}
        player1Name={player1Name}
        player2Name={player2Name}
        player3Name={player3Name}
        player4Name={player4Name}
        selectedPlayer={selectedPlayer}
        onPlayerChange={onPlayerChange}
        disabled={!scoringEnabled}      />

      {/* 
          TENNIS TOOLBAR
       */}

      <TennisToolbar
        onAce={() =>
          onMatchAction(
            'ACE',
            state.server
          )
        }

        onFault={() =>
          onMatchAction(
            'FAULT',
            state.server
          )
        }

        onDoubleFault={() =>
          onMatchAction(
            'DOUBLE_FAULT',
            state.server
          )
        }

        onServe={() =>
          onMatchAction(
            'SERVE',
            state.server
          )
        }

        onWinner={() =>
          onMatchAction(
            'WINNER',
            selectedPlayer
          )
        }

        onError={() =>
          onMatchAction(
            'UNFORCED_ERROR',
            selectedPlayer
          )
        }

        onVolley={() =>
          onMatchAction(
            'VOLLEY',
            selectedPlayer
          )
        }

        onUndo={onUndo}

        undoDisabled={
            !canUndo ||
            !scoringEnabled
          }

          disabled={
            !scoringEnabled
          }
      />

      {/* 
          DIRECT POINT BUTTONS
       */}

    <PointButtons
      player1Name={team1DisplayName}
      player2Name={team2DisplayName}
      onPlayer1Point={() =>
        onAddPoint('PLAYER1')
      }
      onPlayer2Point={() =>
        onAddPoint(
          matchType === 'DOUBLES'
            ? 'PLAYER3'
            : 'PLAYER2'
        )
      }
      disabled={!scoringEnabled}
    />
    </View>
  );
}