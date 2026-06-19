import React from 'react';
import { Text, View } from 'react-native';

import { MatchEvent } from '@/components/match';
import { useTheme } from '@/theme/themeContext';

type Props = {
  logs: MatchEvent[];
};

export default function PenaltyTrackerView({ logs }: Props) {
  const theme = useTheme();

  const count = (wrestler: 'RED' | 'BLUE', move: string) =>
    logs.filter(
      (item) =>
        item.wrestler === wrestler &&
        item.type === 'PENALTY' &&
        item.move === move
    ).length;

  const rows = [
    'Passivity',
    'Warning',
    'Illegal Hold',
    'Unsportsmanlike',
  ];

  const redTotal = logs.filter(
    (item) => item.wrestler === 'RED' && item.type === 'PENALTY'
  ).length;

  const blueTotal = logs.filter(
    (item) => item.wrestler === 'BLUE' && item.type === 'PENALTY'
  ).length;

  return (
    <View>
      <HeaderRow />

      {rows.map((row) => (
        <PenaltyRow
          key={row}
          label={row}
          red={count('RED', row)}
          blue={count('BLUE', row)}
        />
      ))}

      <View
        style={{
          flexDirection: 'row',
          marginTop: theme.spacing.md,
          borderRadius: theme.radius.md,
          overflow: 'hidden',
        }}
      >
        <Text
          style={{
            flex: 1,
            padding: theme.spacing.lg,
            backgroundColor: `${theme.colors.error}11`,
            fontSize: theme.typography.sizes.h3,
            fontWeight: '900',
            color: theme.colors.textPrimary,
          }}
        >
          Total
        </Text>

        <Text
          style={{
            width: theme.spacing.xl * 4,
            padding: theme.spacing.lg,
            backgroundColor: `${theme.colors.error}22`,
            color: theme.colors.error,
            fontSize: theme.typography.sizes.h2,
            fontWeight: '900',
            textAlign: 'center',
          }}
        >
          {redTotal}
        </Text>

        <Text
          style={{
            width: theme.spacing.xl * 4,
            padding: theme.spacing.lg,
            backgroundColor: `${theme.colors.primary}22`,
            color: theme.colors.primary,
            fontSize: theme.typography.sizes.h2,
            fontWeight: '900',
            textAlign: 'center',
          }}
        >
          {blueTotal}
        </Text>
      </View>
    </View>
  );
}

function HeaderRow() {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', paddingBottom: theme.spacing.md }}>
      <Text style={{ flex: 1 }} />
      <Text style={{ width: theme.spacing.xl * 4, color: theme.colors.error, fontWeight: '900', textAlign: 'center' }}>
        RED
      </Text>
      <Text style={{ width: theme.spacing.xl * 4, color: theme.colors.primary, fontWeight: '900', textAlign: 'center' }}>
        BLUE
      </Text>
    </View>
  );
}

function PenaltyRow({
  label,
  red,
  blue,
}: {
  label: string;
  red: number;
  blue: number;
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: theme.colors.border,
        paddingVertical: theme.spacing.lg,
      }}
    >
      <Text style={{ flex: 1, color: theme.colors.textPrimary, fontSize: theme.typography.sizes.body }}>
        {label}
      </Text>

      <Text style={{ width: theme.spacing.xl * 4, color: theme.colors.error, fontWeight: '900', textAlign: 'center' }}>
        {red}
      </Text>

      <Text style={{ width: theme.spacing.xl * 4, color: theme.colors.primary, fontWeight: '900', textAlign: 'center' }}>
        {blue}
      </Text>
    </View>
  );
}