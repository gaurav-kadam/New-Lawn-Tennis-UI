import React from 'react';
import { Text, View } from 'react-native';

import { MatchEvent } from '@/components/match';
import { useTheme } from '@/theme/themeContext';

type Props = {
  logs: MatchEvent[];
  redScore: number;
  blueScore: number;
};

export default function MatchStatsView({
  logs,
  redScore,
  blueScore,
}: Props) {
  const theme = useTheme();

  const count = (wrestler: 'RED' | 'BLUE', type?: string, move?: string) =>
    logs.filter(
      (item) =>
        item.wrestler === wrestler &&
        (!type || item.type === type) &&
        (!move || item.move === move)
    ).length;

  const totalAttacksRed = count('RED', 'ATTACKING');
  const totalAttacksBlue = count('BLUE', 'ATTACKING');

  const successfulRed = logs.filter(
    (item) => item.wrestler === 'RED' && item.type === 'ATTACKING' && item.points > 0
  ).length;

  const successfulBlue = logs.filter(
    (item) => item.wrestler === 'BLUE' && item.type === 'ATTACKING' && item.points > 0
  ).length;

  const leader =
    redScore > blueScore ? 'RED' : blueScore > redScore ? 'BLUE' : 'TIE';

  return (
    <View>
      <HeaderRow />

      <StatRow label="Total Attacks" red={totalAttacksRed} blue={totalAttacksBlue} />
      <StatRow label="Successful Attacks" red={successfulRed} blue={successfulBlue} />
      <StatRow label="Defenses" red={count('RED', 'DEFENDING')} blue={count('BLUE', 'DEFENDING')} />
      <StatRow label="Penalties" red={count('RED', 'PENALTY')} blue={count('BLUE', 'PENALTY')} />
      <StatRow label="Exposures" red={count('RED', undefined, 'Exposure')} blue={count('BLUE', undefined, 'Exposure')} />

      <View
        style={{
          marginTop: theme.spacing.md,
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
          backgroundColor: `${theme.colors.error}11`,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.lg,
        }}
      >
        <Text style={{ flex: 1, fontWeight: '800', color: theme.colors.textPrimary }}>
          Current Leader
        </Text>

        <Text
          style={{
            backgroundColor:
              leader === 'RED'
                ? theme.colors.error
                : leader === 'BLUE'
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
            color: theme.colors.surface,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.radius.md,
            fontWeight: '900',
          }}
        >
          {leader}
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
      <Text style={{ width: theme.spacing.xl * 3, color: theme.colors.error, fontWeight: '900', textAlign: 'center' }}>
        RED
      </Text>
      <Text style={{ width: theme.spacing.xl * 3, color: theme.colors.primary, fontWeight: '900', textAlign: 'center' }}>
        BLUE
      </Text>
    </View>
  );
}

function StatRow({
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
        paddingVertical: theme.spacing.md,
      }}
    >
      <Text style={{ flex: 1, color: theme.colors.textPrimary, fontSize: theme.typography.sizes.body }}>
        {label}
      </Text>

      <Text style={{ width: theme.spacing.xl * 3, color: theme.colors.error, fontWeight: '900', textAlign: 'center' }}>
        {red}
      </Text>

      <Text style={{ width: theme.spacing.xl * 3, color: theme.colors.primary, fontWeight: '900', textAlign: 'center' }}>
        {blue}
      </Text>
    </View>
  );
}