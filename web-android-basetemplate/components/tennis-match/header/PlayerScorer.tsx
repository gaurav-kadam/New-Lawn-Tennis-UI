import React from 'react';
import { Text, View } from 'react-native';

import { styles } from './PlayerScorer.styles';
import { useTheme } from '@/theme/themeContext';

import {
  MatchFormat,
  MatchType,
  PlayerId,
  SetScore,
} from '../types/tennis.types';

type Props = {
  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;

  player1Games: number;
  player2Games: number;

  player1Points: string;
  player2Points: string;

  completedSets: SetScore[];

  server: PlayerId;
  matchType: MatchType;
  matchFormat: MatchFormat;

};

export default function PlayerScorer({
  player1Name,
  player2Name,
  player3Name,
  player4Name,

  player1Games,
  player2Games,

  player1Points,
  player2Points,

  completedSets,

  server,
  matchType,
  matchFormat,

}: Props) {
  const theme = useTheme();

  const totalSets =
    matchFormat === 'BEST_OF_3' ? 3 : 5;

  /*
   * SERVER DISPLAY
   *
   * Singles:
   * PLAYER1 -> Team/Player 1
   * PLAYER2 -> Team/Player 2
   *
   * Doubles:
   * PLAYER1 / PLAYER2 -> Team 1
   * PLAYER3 / PLAYER4 -> Team 2
   */
  const servingSide: 'PLAYER1' | 'PLAYER2' =
    matchType === 'DOUBLES'
      ? server === 'PLAYER1' || server === 'PLAYER2'
        ? 'PLAYER1'
        : 'PLAYER2'
      : server === 'PLAYER1'
        ? 'PLAYER1'
        : 'PLAYER2';

  /*
   * ACTUAL SERVER NAME
   *
   * This is especially important for doubles.
   */
  const servingPlayerName =
    server === 'PLAYER1'
      ? player1Name
      : server === 'PLAYER2'
        ? player2Name
        : server === 'PLAYER3'
          ? player3Name
          : player4Name;

  const rows = [
    {
      id: 'PLAYER1' as PlayerId,
      name: player1Name,
      games: player1Games,
      points: player1Points,
      country: 'IND',
      seed: '1',
    },
    {
      id: 'PLAYER2' as PlayerId,
      name: player2Name,
      games: player2Games,
      points: player2Points,
      country: 'IND',
      seed: '2',
    },
  ];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {/* ====================================================
          PLAYERS
      ==================================================== */}

      <View style={styles.playerPanel}>
        {rows.map((row) => (
          <View
            key={row.id}
            style={styles.playerSummary}
          >
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor:
                    row.id === 'PLAYER1'
                      ? theme.colors.primary
                      : theme.colors.error,
                },
              ]}
            >
              <Text style={styles.avatarText}>
                {row.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.playerTextBlock}>
              <View style={styles.nameRow}>
                {servingSide === row.id && (
                  <View
                    style={[
                      styles.serverDot,
                      {
                        backgroundColor:
                          theme.colors.success,
                      },
                    ]}
                  />
                )}

                <Text
                  numberOfLines={1}
                  style={[
                    styles.playerName,
                    {
                      color:
                        theme.colors.textPrimary,
                    },
                  ]}
                >
                  {row.name}
                </Text>
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.playerMeta,
                  {
                    color:
                      theme.colors.textSecondary,
                  },
                ]}
              >
                {row.country} • Seed {row.seed}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* ====================================================
          SCORE
      ==================================================== */}

      <View
        style={[
          styles.scorePanel,
          {
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.matchStrip,
            {
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.matchStripText,
              {
                color: theme.colors.textPrimary,
              },
            ]}
          >
            {matchType === 'DOUBLES'
              ? 'Doubles'
              : 'Singles'}
          </Text>

          <Text
            style={[
              styles.matchStripDot,
              {
                color:
                  theme.colors.textSecondary,
              },
            ]}
          >
            •
          </Text>

          <Text
            style={[
              styles.matchStripText,
              {
                color:
                  theme.colors.textPrimary,
              },
            ]}
          >
            {matchFormat === 'BEST_OF_3'
              ? 'Best of 3 Sets'
              : 'Best of 5 Sets'}
          </Text>
        </View>

        <View style={styles.scoreHeaderRow}>
          {Array.from({
            length: totalSets,
          }).map((_, index) => (
            <Text
              key={index}
              style={[
                styles.columnLabel,
                {
                  color:
                    theme.colors.textSecondary,
                },
              ]}
            >
              SET {index + 1}
            </Text>
          ))}

          <Text
            style={[
              styles.columnLabel,
              {
                color:
                  theme.colors.textSecondary,
              },
            ]}
          >
            GAME
          </Text>

          <Text
            style={[
              styles.columnLabel,
              {
                color:
                  theme.colors.textSecondary,
              },
            ]}
          >
            POINT
          </Text>
        </View>

        {rows.map((row) => (
          <View
            key={row.id}
            style={[
              styles.scoreRow,
              {
                borderColor:
                  theme.colors.border,
              },
            ]}
          >
            {Array.from({
              length: totalSets,
            }).map((_, index) => {
              const set =
                completedSets[index];

              const value = set
                ? row.id === 'PLAYER1'
                  ? set.player1Games
                  : set.player2Games
                : '-';

              return (
                <Text
                  key={index}
                  style={[
                    styles.scoreCell,
                    {
                      color:
                        theme.colors.textPrimary,
                    },
                  ]}
                >
                  {value}
                </Text>
              );
            })}

            <Text
              style={[
                styles.scoreCell,
                {
                  color:
                    theme.colors.textPrimary,
                },
              ]}
            >
              {row.games}
            </Text>

            <Text
              style={[
                styles.pointCell,
                {
                  color: theme.colors.primary,
                },
              ]}
            >
              {row.points}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}