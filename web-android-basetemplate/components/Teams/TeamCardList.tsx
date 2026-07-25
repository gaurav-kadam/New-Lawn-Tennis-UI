

import React, { useState, useMemo } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Card from '../ui/Card';
import { useTheme } from '@/theme/themeContext';
import TeamActions from './TeamActions';
import FilterSearchBar, { FilterTab } from '@/components/ui/FilterSearchBar';
import Pagination from '@/components/ui/Pagination';
import { tokens } from '../../theme/token';

export default function TeamCardList({
  teams = [], 
  onEdit,
  onDelete,
}: any) {
  const theme = useTheme();

  // Internal search, segmentation, and pagination indicators
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredTeams = useMemo(() => {
    return teams.filter((t: any) => {
      if (filter === 'active' && t.is_active !== true) return false;
      if (filter === 'inactive' && t.is_active !== false) return false;

      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.team_name?.toLowerCase().includes(q) ||
        t.city?.toLowerCase().includes(q) ||
        t.state?.toLowerCase().includes(q) ||
        t.section?.toLowerCase().includes(q)
      );
    });
  }, [teams, filter, search]);

  const paginatedCards = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredTeams.slice(start, end);
  }, [filteredTeams, page, rowsPerPage]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: tokens.spacing.md, gap: 14 }}>
      <FilterSearchBar
        filter={filter}
        onFilterChange={(f: FilterTab) => { setFilter(f); setPage(0); }}
        search={search}
        onSearchChange={(s: string) => { setSearch(s); setPage(0); }}
        searchPlaceholder="Search teams..."
      />

      {paginatedCards.map((t: any) => (
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
              {t.team_name || 'Unknown Team'}
            </Text>

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

            <TeamActions
              tournament={t}      
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </View>
        </Card>
      ))}

      {filteredTeams.length === 0 && (
        <Text style={{ textAlign: 'center', color: theme.colors.textSecondary, marginTop: 20, fontFamily: theme.typography.fontFamily }}>
          No teams found
        </Text>
      )}

      <Pagination
        total={filteredTeams.length}
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