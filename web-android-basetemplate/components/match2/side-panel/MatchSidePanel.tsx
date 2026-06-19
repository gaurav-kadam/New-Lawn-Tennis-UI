import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { MatchEvent } from '@/components/match/types/match.types';
import { useTheme } from '@/theme/themeContext';

type Props = {
  logs: MatchEvent[];
};

export default function MatchSidePanel({ logs }: Props) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>
          Activity Log
        </Text>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator
          contentContainerStyle={styles.scrollContent}
        >
          {logs.length === 0 ? (
            <Text style={styles.emptyText}>
              No activity yet.
            </Text>
          ) : (
            logs.map((item) => {
              const awardedTo =
                item.type === 'PENALTY'
                  ? item.wrestler === 'RED'
                    ? 'BLUE'
                    : 'RED'
                  : item.wrestler;

              const isAwardedRed = awardedTo === 'RED';

              return (
                <View
                  key={item.id}
                  style={[
                    styles.logCard,
                    {
                      backgroundColor: isAwardedRed
                        ? `${theme.colors.error}22`
                        : `${theme.colors.primary}22`,
                      borderColor: isAwardedRed
                        ? `${theme.colors.error}66`
                        : `${theme.colors.primary}66`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      {
                        color: isAwardedRed
                          ? theme.colors.error
                          : theme.colors.primary,
                      },
                    ]}
                  >
                    {item.type}
                  </Text>

                  <Text style={styles.infoText}>
                    {item.type === 'PENALTY'
                      ? `Penalty on ${item.wrestler}`
                      : `${item.wrestler} scored`}
                  </Text>

                  <Text style={styles.infoText}>
                    {awardedTo} awarded {item.points} pts
                  </Text>

                  <Text style={styles.infoText}>
                    Score: RED {item.redScore} - BLUE {item.blueScore}
                  </Text>

                  <Text style={styles.infoText}>
                    Move: {item.move}
                  </Text>

                  <Text style={styles.infoText}>
                    Remarks: {item.remarks || '-'}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => ({
  container: {
    flex: 0.35,
    minWidth: theme.spacing.xl * 8,
    minHeight: 0,
  },

  panel: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadow.medium,
  },

  title: {
    fontSize: theme.typography.h2,
    fontWeight: '800' as const,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },

  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.small,
    fontFamily: theme.typography.fontFamily,
  },

  logCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
  },

  typeText: {
    fontWeight: '800' as const,
    fontFamily: theme.typography.fontFamily,
  },

  infoText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.small,
    marginTop: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily,
  },
});