import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/themeContext';
import Card from '../ui/Card';
import MatchActions from './MatchActions';

export default function MatchCardList({
  matches,
  teams = [],      
  officials = [], 
  onEdit,
  onDelete,
  onStartMatch,
}: any) {
  const theme = useTheme();

  // Helper to resolve full visible team names from the database ID records
  const getTeamName = (teamIdOrField: any) => {
    if (!teamIdOrField) return '—';
    
    const foundTeam = teams.find(
      (item: any) => String(item.id) === String(teamIdOrField)
    );
    
    if (foundTeam) {
      return foundTeam.team_name || foundTeam.teamName || foundTeam.name || '—';
    }
    
    return teamIdOrField;
  };

  // Helper to resolve official names matching records
  const getOfficialName = (officialId: any) => {
    const official = officials.find(
      (item: any) => String(item.id) === String(officialId)
    );
    if (!official) return '—';
    
    const fullName = `${official.first_name || ''} ${official.last_name || ''}`.trim();
    return official.name || fullName || official.official_name || official.official_code || '—';
  };

  return (
    <View style={{ gap: 14 }}>
      {matches && matches.length > 0 ? (
        matches.map((match: any) => (
          <Card key={match.id} variant="elevated">
            <View style={{ padding: 16, gap: 12 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fontFamily,
                }}
              >
                Match No: {match.match_no || '—'}
              </Text>

              <View style={{ gap: 6 }}>
                <Text style={styles.label(theme)}>
                  Date: {match.match_date || match.matchDate || '—'}
                </Text>

                <Text style={styles.label(theme)}>
                  Time: {match.match_time || match.matchTime || '—'}
                </Text>

                <Text style={styles.label(theme)}>
                  Court: {match.court_no || '—'}
                </Text>

                <Text style={styles.label(theme)}>
                  Age Category: {match.age_category || '—'}
                </Text>

                <Text style={styles.label(theme)}>
                  Team A (White): {getTeamName(match.white_team_id || match.whiteTeamId || match.white_team || match.whiteTeam)}
                </Text>

                <Text style={styles.label(theme)}>
                  Team B (Blue): {getTeamName(match.blue_team_id || match.blueTeamId || match.blue_team || match.blueTeam)}
                </Text>

                <Text style={styles.label(theme)}>
                  Gender: {match.gender || '—'}
                </Text>

                <Text style={styles.label(theme)}>
                  Digital Scorer: {match.digital_scorer_id || match.digitalScorerId ? getOfficialName(match.digital_scorer_id || match.digitalScorerId) : '—'}
                </Text>

                <Text style={styles.label(theme)}>
                  Referee 1: {match.referee_1_id || match.referee1Id ? getOfficialName(match.referee_1_id || match.referee1Id) : '—'}
                </Text>

                <Text style={styles.label(theme)}>
                  Referee 2: {match.referee_2_id || match.referee2Id ? getOfficialName(match.referee_2_id || match.referee2Id) : '—'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => onStartMatch(match)}
                style={{
                  backgroundColor: theme.colors.primary,
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: 14,
                    fontFamily: theme.typography.fontFamily,
                  }}
                >
                  Start Match
                </Text>
              </TouchableOpacity>

              <MatchActions
                tournament={match}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </View>
          </Card>
        ))
      ) : (
        <Card variant="elevated">
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={styles.label(theme)}>
              No matches found
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