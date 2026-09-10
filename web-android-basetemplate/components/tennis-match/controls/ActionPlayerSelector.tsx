import React from 'react';
import { Button } from 'react-native-paper';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/theme/themeContext';

import {
  MatchType,
  PlayerId,
} from '../types/tennis.types';

type Props = {
  matchType: MatchType;

  player1Name: string;
  player2Name: string;
  player3Name?: string;
  player4Name?: string;

  selectedPlayer: PlayerId;

  onPlayerChange: (
    player: PlayerId
  ) => void;

  disabled?: boolean;
};

type PlayerOption = {
  id: PlayerId;
  name: string;
};

export default function ActionPlayerSelector({
  matchType,
  player1Name,
  player2Name,
  player3Name = '',
  player4Name = '',
  selectedPlayer,
  onPlayerChange,
  disabled = false,
}: Props) {
  const theme = useTheme();

  const players: PlayerOption[] = [
    {
      id: 'PLAYER1',
      name: player1Name,
    },
    {
      id: 'PLAYER2',
      name: player2Name,
    },
  ];

  if (matchType === 'DOUBLES') {
    players.push(
      {
        id: 'PLAYER3',
        name: player3Name || 'Player 3',
      },
      {
        id: 'PLAYER4',
        name: player4Name || 'Player 4',
      }
    );
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.textSecondary,
          },
        ]}
      >
        ACTION PLAYER
      </Text>

      <View style={styles.playersContainer}>
        {players.map((player) => {
          const isSelected =
            selectedPlayer === player.id;

          return (
            <Button
              key={player.id}
              onPress={() =>
                onPlayerChange(player.id)
              }
              disabled={disabled}
              mode="outlined"
              uppercase={false}
              rippleColor="transparent"
              hitSlop={{ top: 1, bottom: 1, left: 9, right: 9 }}
              contentStyle={styles.paperContent}
              style={[
                styles.playerButton,
                styles.paperButton,
                {
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.surface,

                  borderColor:
                    theme.colors.border,

                  opacity: disabled ? 0.45 : 1,
                },
              ]}
              labelStyle={[
                styles.paperLabel,
                styles.playerName,
                {
                  color: isSelected
                    ? theme.colors.textLight
                    : theme.colors.textPrimary,
                },
              ]}
            >
              {player.name}
            </Button>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
  },

  playersContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },

  playerButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 8,
  },

  paperButton: {
    minWidth: 0,
    alignItems: 'stretch',
  },
  paperContent: {
    height: 34, 
    paddingHorizontal: 0,
  },
  paperLabel: {
    marginHorizontal: 0,
    marginVertical: 0,
    fontFamily: undefined,
    lineHeight: undefined,
    letterSpacing: undefined,
    textAlign: undefined,
    writingDirection: undefined,
    flexShrink: 1,
  },

  playerName: {
    fontSize: 14,
    fontWeight: '800',
  },
});