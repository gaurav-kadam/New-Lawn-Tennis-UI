import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';

import { styles } from './RecentEvent.style';
import {
  ScrollView,
  type TextStyle,
  View,
} from 'react-native';

import { useTheme } from '@/theme/themeContext';

import {
  formatMatchTime,
} from '../hooks/useMatchTimer';

import {
  PlayerId,
  TennisEventRecord,
  TennisEventType,
} from '../types/tennis.types';

// Keep RN's platform defaults instead of Paper's font, spacing and direction.
// Existing per-label styles remain last, including the empty message line height.
const nativeTextDefaults: TextStyle = {
  fontFamily: undefined,
  fontWeight: undefined,
  letterSpacing: undefined,
  lineHeight: undefined,
  textAlign: undefined,
  writingDirection: undefined,
};

type Props = {
  events: TennisEventRecord[];

  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;

  team1DisplayName: string;
  team2DisplayName: string;

  matchType: 'SINGLES' | 'DOUBLES';

  compact?: boolean;
};

const EVENT_LABELS: Record<
  TennisEventType,
  string
> = {
  ACE: 'ACE',
  FAULT: 'FAULT',
  DOUBLE_FAULT: 'DOUBLE FAULT',
  WINNER: 'WINNER',
  UNFORCED_ERROR: 'UNFORCED ERROR',
  VOLLEY: 'VOLLEY',
  SERVE: 'SERVE IN',
  POINT: 'POINT',
};

const EVENT_ICONS: Record<
  TennisEventType,
  React.ComponentProps<
    typeof Ionicons
  >['name']
> = {
  ACE: 'star',
  FAULT: 'alert-circle-outline',
  DOUBLE_FAULT: 'close-circle',
  WINNER: 'trophy-outline',
  UNFORCED_ERROR: 'close-circle',
  VOLLEY: 'tennisball-outline',
  SERVE: 'arrow-forward-circle-outline',
  POINT: 'add-circle-outline',
};

const ERROR_EVENTS =
  new Set<TennisEventType>([
    'FAULT',
    'DOUBLE_FAULT',
    'UNFORCED_ERROR',
  ]);

function getPlayerName(
  player: PlayerId,
  props: Props
): string {
  switch (player) {
    case 'PLAYER1':
      return props.player1Name;

    case 'PLAYER2':
      return props.player2Name;

    case 'PLAYER3':
      return props.player3Name || 'Player 3';

    case 'PLAYER4':
      return props.player4Name || 'Player 4';
  }
}
function getDisplayName(
  event: TennisEventRecord,
  props: Props
): string {

  /*
   * POINT events represent the scoring side.
   *
   * SINGLES:
   * PLAYER1 -> Team 1
   * PLAYER2 -> Team 2
   *
   * DOUBLES:
   * PLAYER1 / PLAYER2 -> Team 1
   * PLAYER3 / PLAYER4 -> Team 2
   */
  if (event.type === 'POINT') {

    if (props.matchType === 'SINGLES') {
      return event.player === 'PLAYER1'
        ? props.team1DisplayName
        : props.team2DisplayName;
    }

    return (
      event.player === 'PLAYER1' ||
      event.player === 'PLAYER2'
    )
      ? props.team1DisplayName
      : props.team2DisplayName;
  }

  return getPlayerName(
    event.player,
    props
  );
}

export default function RecentEvents({
  events,
  player1Name,
  player2Name,
  player3Name,
  player4Name,
  team1DisplayName,
  team2DisplayName,
  matchType,
  compact = false,
}: Props) {
  const theme = useTheme();

  const displayEvents = events;

  return (
    <View
      style={[
        styles.container,
        compact &&
          styles.containerCompact,
        {
          borderColor:
            theme.colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor:
              '#263244',
          },
        ]}
      >
        <Text
          style={[nativeTextDefaults, styles.headerTitle]}
        >
          RECENT EVENTS
        </Text>

        <Text
          style={[nativeTextDefaults, styles.headerCount]}
        >
          {events.length}
        </Text>
      </View>

      {displayEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="list-outline"
            size={20}
            color="#64748B"
          />

          <Text
            style={[nativeTextDefaults, styles.emptyTitle]}
          >
            No events yet
          </Text>

          <Text
            style={[nativeTextDefaults, styles.emptyText]}
          >
            Recorded match actions
            will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={
            styles.listContent
          }
          showsVerticalScrollIndicator={
            false
          }
          nestedScrollEnabled
        >
          {displayEvents.map(
            (event) => {
              const isError =
                ERROR_EVENTS.has(
                  event.type
                );

              return (
                <View
                  key={event.id}
                  style={styles.eventRow}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor:
                          isError
                            ? theme.colors.error
                            : theme.colors.primary,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        EVENT_ICONS[
                          event.type
                        ]
                      }
                      size={14}
                      color={
                        theme.colors.textLight
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.eventContent
                    }
                  >
                    <Text
                      numberOfLines={1}
                      style={[nativeTextDefaults, styles.eventTitle]}
                    >
                      {
                        EVENT_LABELS[
                          event.type
                        ]
                      }
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={[nativeTextDefaults, styles.eventPlayer]}
                    >
                      {getDisplayName(
                        event,
                        {
                          events,
                          player1Name,
                          player2Name,
                          player3Name,
                          player4Name,
                          team1DisplayName,
                          team2DisplayName,
                          matchType,
                          compact,
                        }
                      )}
                    </Text>
                  </View>

                  <Text
                    style={[nativeTextDefaults, styles.eventTime]}
                  >
                    {formatMatchTime(
                      event.elapsedSeconds
                    )}
                  </Text>
                </View>
              );
            }
          )}
        </ScrollView>
      )}
    </View>
  );
}

