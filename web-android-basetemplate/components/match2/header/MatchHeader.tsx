import React, { useState } from 'react';
import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';

import { MatchEvent, Wrestler } from '@/components/match';
import Button from '@/components/ui/Button';
import { useTheme } from '@/theme/themeContext';

import MatchDetailsBottomSheet from '../details/MatchDetailsBottomSheet';
import MatchStatsView from '../details/MatchStatsView';
import PenaltyTrackerView from '../details/PenaltyTrackerView';
import CircularTimer from '../timer/CircularTimer';
import HeaderIconButton from './HeaderIconButton';

type Props = {
  selectedWrestler: Wrestler | null;
  onSelectWrestler: (wrestler: Wrestler) => void;

  redScore: number;
  blueScore: number;
  logs: MatchEvent[];

  session: number;

  redPlayerName?: string;
 bluePlayerName?: string;
 matchNo?: string;
 courtNo?: string;

  onToggleTimer: () => void;
  onEndMatch: () => void;
  onUndo: () => void;
  onResetMatch: () => void;
  onEndSession: () => void;
  undoDisabled: boolean;

  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
};

export default function MatchHeader({
  redPlayerName = 'Red Player',
  bluePlayerName = 'Blue Player',
  matchNo = '',
  courtNo = '',
  selectedWrestler,
  onSelectWrestler,
  redScore,
  blueScore,
  logs,
  session,
  onToggleTimer,
  onEndMatch,
  onUndo,
  onEndSession,
  onResetMatch,
  undoDisabled,
  timeLeft,
  totalTime,
  isRunning,
}: Props) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [statsOpen, setStatsOpen] = useState(false);
  const [penaltyOpen, setPenaltyOpen] = useState(false);

  const teamTextStyle: TextStyle = {
    fontSize: theme.typography.sizes.h1,
    fontWeight: '800',
    color: theme.colors.surface,
    fontFamily: theme.typography.fontFamily,
  };

  const scoreTextStyle: TextStyle = {
    fontSize: theme.typography.sizes.h1,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  };

  const teamBoxStyle = (
    wrestler: Wrestler,
    active: boolean
  ): ViewStyle => ({
    ...styles.teamBox,
    backgroundColor:
      wrestler === 'RED'
        ? theme.colors.error
        : theme.colors.primary,
    borderWidth: active ? theme.spacing.xs : 0,
    borderColor: theme.colors.textPrimary,
  });

  return (
    <>
      <View style={styles.container}>
        <Pressable
          onPress={() => onSelectWrestler('RED')}
          style={teamBoxStyle('RED', selectedWrestler === 'RED')}
        >
          <Text style={teamTextStyle}>RED</Text>
        </Pressable>

        <View style={styles.centerSection}>
          <View style={styles.scoreBox}>
            <Text style={scoreTextStyle}>{redScore}</Text>
          </View>

          <View style={styles.controls}>
            <Button
              title="End Session"
              size="sm"
              variant="outline"
              disabled={session !== 1}
              onPress={onEndSession}
            />

            <Button
              title="End Match"
              size="sm"
              variant="danger"
              disabled={false}
              onPress={onEndMatch}
            />

            <Text style={styles.sessionText}>Session {session}</Text>

            <CircularTimer
              timeLeft={timeLeft}
              totalTime={totalTime}
              isRunning={isRunning}
              onToggle={onToggleTimer}
            />

            <Button
              title="Undo"
              size="sm"
              variant="outline"
              disabled={undoDisabled}
              onPress={onUndo}
            />

            <Button
              title="Reset"
              size="sm"
              variant="outline"
              onPress={onResetMatch}
            />

            <HeaderIconButton
              icon="bar-chart"
              onPress={() => setStatsOpen(true)}
            />

            <HeaderIconButton
              icon="shield-checkmark"
              onPress={() => setPenaltyOpen(true)}
            />
          </View>

          <View style={styles.scoreBox}>
            <Text style={scoreTextStyle}>{blueScore}</Text>
          </View>
        </View>

        <Pressable
          onPress={() => onSelectWrestler('BLUE')}
          style={teamBoxStyle('BLUE', selectedWrestler === 'BLUE')}
        >
          <Text style={teamTextStyle}>BLUE</Text>
        </Pressable>
      </View>

      <MatchDetailsBottomSheet
        visible={statsOpen}
        title="Match Stats"
        onClose={() => setStatsOpen(false)}
      >
        <MatchStatsView
          logs={logs}
          redScore={redScore}
          blueScore={blueScore}
        />
      </MatchDetailsBottomSheet>

      <MatchDetailsBottomSheet
        visible={penaltyOpen}
        title="Penalty Tracker"
        onClose={() => setPenaltyOpen(false)}
      >
        <PenaltyTrackerView logs={logs} />
      </MatchDetailsBottomSheet>
    </>
  );
}

const createStyles = (theme: any) => ({
  container: {
    flexDirection: 'row' as const,
    minHeight: theme.spacing.xl * 3,
    width: '100%' as const,
    backgroundColor: theme.colors.matchScreen.headerColor,
    borderRadius: theme.radius.lg,
    overflow: 'hidden' as const,
  },

  teamBox: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  centerSection: {
    flex: 3,
    flexDirection: 'row' as const,
    minWidth: 0,
  },

  scoreBox: {
    minWidth: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  controls: {
    flex: 1,
    minWidth: 0,
    backgroundColor: theme.colors.background,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },

  sessionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.small,
    fontWeight: '700' as const,
    fontFamily: theme.typography.fontFamily,
  },
});