import React from 'react';
import { Platform, StyleSheet, type TextStyle, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  IconButton,
  Text,
  Text as PaperText,
  TouchableRipple,
} from 'react-native-paper';

import { useTheme } from '@/theme/themeContext';
import TennisSettingsModal from './TennisSettingsModal';

import { formatMatchTime, MatchTimerStatus } from '../hooks/useMatchTimer';

// Keep timer labels on the existing native typography.
const timerTextDefaults: TextStyle = {
  fontFamily: undefined,
  fontWeight: undefined,
  lineHeight: undefined,
  letterSpacing: undefined,
  textAlign: undefined,
  writingDirection: undefined,
};

type Props = {
  controlsDisabled?: boolean;
  onBack: () => void;

  matchCompleted: boolean;

  courtName?: string;

  elapsedSeconds: number;

  timerStatus: MatchTimerStatus;

  onStart: () => void;

  onPause: () => void;

  onStop: () => void;

  matchNo?: string;

  isFullscreen: boolean;

  onRestartMatch: () => void;

  onResetMatch: () => void;

  onToggleFullscreen: () => void;
};
export default function TennisHeader({
  controlsDisabled = false,
  onBack,
  matchCompleted,
  courtName = 'Court 1',
  elapsedSeconds,
  timerStatus,
  onStart,
  onPause,
  onStop,
  matchNo,
  isFullscreen,
  onRestartMatch,
  onResetMatch,
  onToggleFullscreen,
}: Props) {
  const theme = useTheme();

  const canStart =
    !controlsDisabled && (timerStatus === 'idle' || timerStatus === 'paused');

  const canPause = !controlsDisabled && timerStatus === 'running';

  const canStop =
    !controlsDisabled &&
    (timerStatus === 'running' || timerStatus === 'paused');

  const statusLabel = matchCompleted
    ? 'COMPLETED'
    : timerStatus === 'running'
      ? 'LIVE'
      : timerStatus === 'paused'
        ? 'PAUSED'
        : timerStatus === 'stopped'
          ? 'STOPPED'
          : 'READY';

  const isLive = timerStatus === 'running' && !matchCompleted;

  const [settingsVisible, setSettingsVisible] = React.useState(false);

  const [settingsPressed, setSettingsPressed] = React.useState(false);

  const [startPressed, setStartPressed] = React.useState(false);
  const [pausePressed, setPausePressed] = React.useState(false);
  const [stopPressed, setStopPressed] = React.useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,

          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* LEFT */}

      <View style={styles.left}>
        <IconButton
          onPress={onBack}
          size={18}
          iconColor={theme.colors.textPrimary}
          icon={({ size, color }) => (
            <Ionicons name="arrow-back" size={size} color={color} />
          )}
          rippleColor="transparent"
          hitSlop={1}
          contentStyle={styles.paperIconContent}
          style={[
            styles.iconButton,
            styles.paperIconButton,
            { borderColor: theme.colors.border },
          ]}
        />

        <View>
          <Text
            style={[
              timerTextDefaults,
              styles.title,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            LAWN TENNIS
          </Text>

          <Text
            style={[
              timerTextDefaults,
              styles.subtitle,
              {
                color: theme.colors.textSecondary,
              },
            ]}
          >
            {matchNo ? `Match ${matchNo}` : 'Live Scoreboard'}
          </Text>
        </View>
      </View>

      {/* CENTER TIMER */}

      <View pointerEvents="box-none" style={styles.center}>
        <Text
          style={[
            timerTextDefaults,
            styles.timerText,
            {
              color: theme.colors.textPrimary,
            },
          ]}
        >
          {formatMatchTime(elapsedSeconds)}
        </Text>

        <Text
          style={[
            timerTextDefaults,
            styles.timerLabel,
            {
              color: theme.colors.textSecondary,
            },
          ]}
        >
          MATCH TIME
        </Text>

        <View style={styles.timerControls}>
          {/* START / RESUME */}

          <TouchableRipple
            rippleColor="transparent"
            underlayColor="transparent"
            onPressIn={() => setStartPressed(true)}
            onPressOut={() => setStartPressed(false)}
            onPress={onStart}
            disabled={!canStart}
            style={[
              styles.timerButton,
              {
                backgroundColor: theme.colors.success,

                borderColor: theme.colors.success,

                opacity: !canStart ? 0.35 : startPressed ? 0.75 : 1,
              },
            ]}
          >
            <>
              <Ionicons name="play" size={13} color={theme.colors.textLight} />

              <PaperText
                style={[
                  timerTextDefaults,
                  styles.timerButtonText,
                  {
                    color: theme.colors.textLight,
                  },
                ]}
              >
                {timerStatus === 'paused' ? 'RESUME' : 'START'}
              </PaperText>
            </>
          </TouchableRipple>

          {/* PAUSE */}

          <TouchableRipple
            rippleColor="transparent"
            underlayColor="transparent"
            onPressIn={() => setPausePressed(true)}
            onPressOut={() => setPausePressed(false)}
            onPress={onPause}
            disabled={!canPause}
            style={[
              styles.timerButton,
              {
                backgroundColor: theme.colors.surface,

                borderColor: theme.colors.border,

                opacity: !canPause ? 0.35 : pausePressed ? 0.75 : 1,
              },
            ]}
          >
            <>
              <Ionicons
                name="pause"
                size={13}
                color={theme.colors.textPrimary}
              />

              <PaperText
                style={[
                  timerTextDefaults,
                  styles.timerButtonText,
                  {
                    color: theme.colors.textPrimary,
                  },
                ]}
              >
                PAUSE
              </PaperText>
            </>
          </TouchableRipple>

          {/* STOP */}

          <TouchableRipple
            rippleColor="transparent"
            underlayColor="transparent"
            onPressIn={() => setStopPressed(true)}
            onPressOut={() => setStopPressed(false)}
            onPress={onStop}
            disabled={!canStop}
            style={[
              styles.timerButton,
              {
                backgroundColor: theme.colors.error,

                borderColor: theme.colors.error,

                opacity: !canStop ? 0.35 : stopPressed ? 0.75 : 1,
              },
            ]}
          >
            <>
              <Ionicons name="stop" size={13} color={theme.colors.textLight} />

              <PaperText
                style={[
                  timerTextDefaults,
                  styles.timerButtonText,
                  {
                    color: theme.colors.textLight,
                  },
                ]}
              >
                STOP
              </PaperText>
            </>
          </TouchableRipple>
        </View>
      </View>

      {/* RIGHT */}

      <View style={styles.right}>
        <View
          style={[
            styles.liveBadge,
            {
              backgroundColor: isLive
                ? `${theme.colors.success}18`
                : matchCompleted
                  ? `${theme.colors.primary}18`
                  : `${theme.colors.border}18`,

              borderColor: isLive
                ? theme.colors.success
                : matchCompleted
                  ? theme.colors.primary
                  : theme.colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.liveDot,
              {
                backgroundColor: isLive
                  ? theme.colors.success
                  : matchCompleted
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
              },
            ]}
          />

          <Text
            style={[
              timerTextDefaults,
              styles.liveText,
              {
                color: isLive
                  ? theme.colors.success
                  : matchCompleted
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
              },
            ]}
          >
            {statusLabel}
          </Text>
        </View>

        <Text
          style={[
            timerTextDefaults,
            styles.courtText,
            {
              color: theme.colors.textPrimary,
            },
          ]}
        >
          {courtName}
        </Text>
        <IconButton
          onPress={() => setSettingsVisible(true)}
          onPressIn={() => setSettingsPressed(true)}
          onPressOut={() => setSettingsPressed(false)}
          size={18}
          iconColor={theme.colors.textPrimary}
          icon={({ size, color }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
          rippleColor="transparent"
          hitSlop={1}
          contentStyle={styles.paperIconContent}
          style={[
            styles.iconButton,
            styles.paperIconButton,
            {
              borderColor: theme.colors.border,
              backgroundColor: settingsPressed
                ? `${theme.colors.primary}10`
                : 'transparent',
            },
          ]}
        />

        <TennisSettingsModal
          actionsDisabled={controlsDisabled}
          visible={settingsVisible}
          isFullscreen={isFullscreen}
          onClose={() => setSettingsVisible(false)}
          onRestart={() => {
            setSettingsVisible(false);
            onRestartMatch();
          }}
          onReset={() => {
            setSettingsVisible(false);
            onResetMatch();
          }}
          onToggleFullscreen={() => {
            onToggleFullscreen();
            setSettingsVisible(false);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 112,

    paddingHorizontal: 16,
    paddingVertical: 9,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    borderWidth: 1,

    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

    gap: 12,

    position: 'relative',
  },

  left: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    minWidth: 0,
  },

  center: {
    position: 'absolute',

    left: 0,
    right: 0,

    top: 8,
    bottom: 8,

    alignItems: 'center',

    justifyContent: 'center',

    zIndex: 2,
  },

  right: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'flex-end',

    gap: 8,

    minWidth: 0,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
  },

  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  iconButton: {
    width: 34,
    height: 34,

    borderRadius: 8,

    borderWidth: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },

  paperIconButton: {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  paperIconContent: {
    // Fill the original 32px inner area; hitSlop covers only the 1px border.
    alignSelf: 'stretch',
    padding: 0,
    borderRadius: 7,
  },

  liveBadge: {
    height: 26,

    borderRadius: 999,

    borderWidth: 1,

    paddingHorizontal: 9,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,
  },

  liveDot: {
    width: 7,
    height: 7,

    borderRadius: 999,
  },

  liveText: {
    fontSize: 11,
    fontWeight: '800',
  },

  courtText: {
    fontSize: 14,
    fontWeight: '800',
  },

  timerText: {
    fontSize: 24,

    lineHeight: 28,

    fontWeight: '900',

    fontVariant: ['tabular-nums'],

    letterSpacing: 1.5,
  },

  timerLabel: {
    marginTop: 1,

    fontSize: 9,

    fontWeight: '800',

    letterSpacing: 0.8,

    textTransform: 'uppercase',
  },

  timerControls: {
    flexDirection: 'row',

    gap: 6,

    marginTop: 6,
  },

  timerButton: {
    minWidth: 72,

    height: 27,

    paddingHorizontal: 8,

    borderRadius: 6,

    borderWidth: 1,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 4,
  },

  timerButtonText: {
    fontSize: 9,

    fontWeight: '900',
  },
});
