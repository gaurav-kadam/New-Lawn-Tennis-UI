import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '@/theme/themeContext';
import { SessionResult } from './types';

type Props = {
  result: SessionResult;
};

export default function SessionResultCard({
  result,
}: Props) {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.sm,
      }}
    >
      <Text
        style={{
          color: theme.colors.textSecondary,
          marginBottom: 4,
          fontWeight: '700',
        }}
      >
        Session {result.session}
      </Text>

      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: 18,
          fontWeight: '800',
        }}
      >
        RED {result.redScore} - BLUE {result.blueScore}
      </Text>
    </View>
  );
}