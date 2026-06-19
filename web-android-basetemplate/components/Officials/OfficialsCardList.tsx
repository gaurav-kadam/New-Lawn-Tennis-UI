import { Text, View } from 'react-native';

import Card from '../ui/Card';
import { useTheme } from '@/theme/themeContext';
import TournamentActions from './OfficialsActions';

export default function OfficialsCardList({
  officials = [], // ✅ Receives officials array safely
  onEdit,
  onDelete,
}: any) {
  const theme = useTheme();

  return (
    <View style={{ gap: 14 }}>
      {officials.map((t: any) => {
        
        const fullName = `${t.first_name || ''} ${t.last_name || ''}`.trim() || 'Unknown Official';

        return (
          <Card key={t.id} variant="elevated">
            <View style={{ padding: 16, gap: 12 }}>

              {/* ✅ Shows Official Full Name instead of tournament_name */}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fontFamily,
                }}
              >
                {fullName}
              </Text>

              {/* ✅ Accesses actual Official object fields matching your table view */}
              <View style={{ gap: 6 }}>
                <Text style={styles.label(theme)}>
                  Email: {t.email || '—'}
                </Text>

                <Text style={styles.label(theme)}>
                  Phone: {t.phone_no || '—'}
                </Text>

                <Text style={styles.label(theme)}>
                  State: {t.state || '—'}
                </Text>

                <Text style={styles.label(theme)}>
                  Gender: {t.gender || '—'}
                </Text>
              </View>

              <TournamentActions
                tournament={t} // Forwards the row item to your action component
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </View>
          </Card>
        );
      })}
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