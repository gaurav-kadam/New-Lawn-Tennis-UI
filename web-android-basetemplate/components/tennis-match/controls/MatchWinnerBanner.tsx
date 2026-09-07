import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/theme/themeContext';

type Props = {
  winnerName?: string | null | undefined;
  onFinalize?: () => void;
  isFinalizing?: boolean;
};

export default function MatchWinnerBanner({
  winnerName,
  onFinalize,
  isFinalizing = false,
}: Props) {
  const theme = useTheme();

  if (!winnerName) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.textLight,
          },
        ]}
      >
        MATCH COMPLETE
      </Text>

      <Text
        style={[
          styles.winner,
          {
            color: theme.colors.textLight,
          },
        ]}
        numberOfLines={1}
      >
        {winnerName}
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: theme.colors.textLight,
          },
        ]}
      >
        Winner
      </Text>

      {onFinalize && (
        <Pressable
          disabled={isFinalizing}
          onPress={onFinalize}
          style={[
            styles.finishButton,
            {
              backgroundColor:
                theme.colors.surface,
              opacity: isFinalizing ? 0.65 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.finishButtonText,
              {
                color: theme.colors.primary,
              },
            ]}
          >
            {isFinalizing
              ? 'Saving Match...'
              : 'Finish Match'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },

  winner: {
    marginTop: 3,
    fontSize: 18,
    fontWeight: '900',
  },

  subtitle: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.85,
  },

  finishButton: {
    marginTop: 12,
    minWidth: 170,
    minHeight: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  finishButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
});