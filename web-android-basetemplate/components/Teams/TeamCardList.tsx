import { Text, View } from 'react-native';

import Card from '../ui/Card';
import { useTheme } from '@/theme/themeContext';
import TeamActions from './TeamActions'; // Uses your TeamActions component

export default function TeamCardList({
  teams = [], 
  onEdit,
  onDelete,
}: any) {
  const theme = useTheme();

  return (
    <View style={{ gap: 14 }}>
      {teams.map((t: any) => (
        <Card key={t.id} variant="elevated">
          <View style={{ padding: 16, gap: 12 }}>

            {/* Title - Matches Tournament Header Style Exactly */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              {t.team_name || 'Unknown Team'}
            </Text>

            {/* Info Fields - Matches Tournament Metadata Layout Exactly */}
            <View style={{ gap: 6 }}>
              <Text style={styles.label(theme)}>
                Coach: {t.coach || '—'}
              </Text>

              <Text style={styles.label(theme)}>
                Head Coach: {t.head_coach || '—'}
              </Text>

              <Text style={styles.label(theme)}>
                Manager: {t.manager || '—'}
              </Text>

              <Text style={styles.label(theme)}>
                Section: {t.section || '—'}
              </Text>

              <Text style={styles.label(theme)}>
                State: {t.state || '—'}
              </Text>

              <Text style={styles.label(theme)}>
                Gender: {t.gender || '—'}
              </Text>
              
              <Text style={styles.label(theme)}>
                Status: {t.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>

            {/* Action Buttons Layer */}
            <TeamActions
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