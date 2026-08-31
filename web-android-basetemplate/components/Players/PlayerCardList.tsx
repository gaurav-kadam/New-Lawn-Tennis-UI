import React from 'react';
import { Text, View } from 'react-native';

import Card from '@/components/ui/Card';
import { useTheme } from '@/theme/themeContext';
import PlayerActions from '../Players/PlayerActions';

type Props = {
  players: any[];
  onEdit?: (player: any) => void;
  onDelete?: (id: any) => void;
};

export default function PlayerCardList({
  players,
  onEdit,
  onDelete,
}: Props) {
  const theme = useTheme();
  const canShowActions = Boolean(onEdit || onDelete);

  return (
    <View style={{ gap: 14 }}>
      {players.map((player) => (
        <Card key={player.id} variant="elevated">
          <View style={{ padding: 16, gap: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              {player.name || '—'}
            </Text>

            <View style={{ gap: 6 }}>
              <Text style={styles.label(theme)}>
                Age: {player.age || '—'}
              </Text>

              <Text style={styles.label(theme)}>
                Gender: {player.gender || '—'}
              </Text>

              <Text style={styles.label(theme)}>
                Weight: {player.weight || '—'}
              </Text>

              <Text style={styles.label(theme)}>
                Category: {player.category || '—'}
              </Text>

              <Text style={styles.label(theme)}>
                City: {player.city || '—'}
              </Text>
            </View>

            {canShowActions && (
              <PlayerActions
                player={player}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </View>
        </Card>
      ))}

      {players.length === 0 && (
        <Card variant="elevated">
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={styles.label(theme)}>
              No players registered yet.
            </Text>
          </View>
        </Card>
      )}
    </View>
  );
}

const styles = {
  label: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
  }),
};