import { Text, View } from 'react-native';

import Card from '../ui/Card';
import { useTheme } from '@/theme/themeContext';
import TournamentActions from './UserManagementActions';

export default function UserManagementCardList({
  tournaments,
  onEdit,
  onDelete,
}: any) {
  const theme = useTheme();

  return (
    <View style={{ gap: 14 }}>
      {tournaments.map((t: any) => (
        <Card key={t.id} variant="elevated">
          <View style={{ padding: 16, gap: 12 }}>

            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              {t.tournament_name}
            </Text>

            <View style={{ gap: 6 }}>
              <Text style={styles.label(theme)}>
                Start: {t.start_date || '—'}
              </Text>

              <Text style={styles.label(theme)}>
                End: {t.end_date || '—'}
              </Text>

              <Text style={styles.label(theme)}>
                Section: {t.section || '—'}
              </Text>

              <Text style={styles.label(theme)}>
                Gender: {t.gender || '—'}
              </Text>
            </View>

            <TournamentActions
              tournament={t}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </View>
        </Card>
      ))}
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