

import React, { useState, useMemo } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useTheme } from '@/theme/themeContext';
import Card from '../ui/Card';
import MatchActions from './MatchActions';
import FilterSearchBar from '@/components/ui/FilterSearchBar';
import Pagination from '@/components/ui/Pagination';

type MatchFilter = 'all' | 'incomplete' | 'completed';

export default function MatchCardList({
  matches = [],
  teams = [],      
  officials = [], 
  onEdit,
  onDelete,
  onStartMatch,
}: any) {
  const theme = useTheme();

  // Local state controls for managing list configurations natively
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getTeamName = (teamIdOrField: any) => {
    if (!teamIdOrField) return '—';
    const foundTeam = teams.find((item: any) => String(item.id) === String(teamIdOrField));
    if (foundTeam) {
      return foundTeam.team_name || foundTeam.teamName || foundTeam.name || '—';
    }
    return teamIdOrField;
  };

  const getOfficialName = (officialId: any) => {
    const official = officials.find((item: any) => String(item.id) === String(officialId));
    if (!official) return '—';
    const fullName = `${official.first_name || ''} ${official.last_name || ''}`.trim();
    return official.name || fullName || official.official_name || official.official_code || '—';
  };

  const filteredMatches = useMemo(() => {
    return matches.filter((m: any) => {
      if (filter === 'completed' && m.is_complete !== true) return false;
      if (filter === 'incomplete' && m.is_complete === true) return false;

      if (!search) return true;
      const q = search.toLowerCase();
      return (
        m.match_date?.toLowerCase().includes(q) ||
        m.age_category?.toLowerCase().includes(q) ||
        m.gender?.toLowerCase().includes(q) ||
        String(m.match_no || '').toLowerCase().includes(q) ||
        String(m.court_no || '').toLowerCase().includes(q)
      );
    });
  }, [matches, filter, search]);

  const paginatedCards = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredMatches.slice(start, end);
  }, [filteredMatches, page, rowsPerPage]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.md || 15, gap: 14 }}>
      <FilterSearchBar
        filter={filter}
        onFilterChange={(f: MatchFilter) => { setFilter(f); setPage(0); }}
        search={search}
        onSearchChange={(s: string) => { setSearch(s); setPage(0); }}
        searchPlaceholder="Search matches..."
        tabs={[
          { label: 'All', value: 'all' },
          { label: 'Incomplete', value: 'incomplete' },
          { label: 'Completed', value: 'completed' },
        ]}
      />

      {paginatedCards.length > 0 ? (
        paginatedCards.map((match: any) => (
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
                  Team A (White): {getTeamName(match.team1_id || match.whiteTeamId || match.team1 || match.whiteTeam)}
                </Text>
                <Text style={styles.label(theme)}>
                  Team B (Blue): {getTeamName(match.team2_id || match.blueTeamId || match.team2 || match.blueTeam)}
                </Text>
                <Text style={styles.label(theme)}>
                  Gender: {match.gender || '—'}
                </Text>
                <Text style={styles.label(theme)}>
                  Digital Scorer:  {getOfficialName(match.digital_scorer_code) || '—'}
                </Text>
                <Text style={styles.label(theme)}>
                  Referee 1: {match.referee_1_id || match.referee1Id ? getOfficialName(match.referee_1_id || match.referee1Id) : '—'}
                </Text>
                <Text style={styles.label(theme)}>
                  Referee 2: {match.referee_2_id || match.referee2Id ? getOfficialName(match.referee_2_id || match.referee2Id) : '—'}
                </Text>
                <Text style={styles.label(theme)}>
                  Status: {match.is_complete ? 'Completed' : 'Incomplete'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                            if (
                              typeof document !== 'undefined' &&
                              document.fullscreenEnabled &&
                              !document.fullscreenElement
                            ) {
                              document.documentElement
                                .requestFullscreen()
                                .catch(() => undefined);
                            }
                          
                            onStartMatch(
                              match
                            );
                          }}
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

      <Pagination
        total={filteredMatches.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(rpp: number) => { setRowsPerPage(rpp); setPage(0); }}
      />
    </ScrollView>
  );
}

const styles = {
  label: (theme: any) => ({
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
  }),
};