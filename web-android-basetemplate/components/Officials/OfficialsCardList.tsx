

import React, { useState, useMemo } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Card from '../ui/Card';
import { useTheme } from '@/theme/themeContext';
import TournamentActions from './OfficialsActions';
import FilterSearchBar, { FilterTab } from '@/components/ui/FilterSearchBar';
import Pagination from '@/components/ui/Pagination';

export default function OfficialsCardList({
  officials = [],
  onEdit,
  onDelete,
}: any) {
  const theme = useTheme();

  // Internal states handling view modifications inside the scroll containers
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredOfficials = useMemo(() => {
    return officials.filter((o: any) => {
      if (filter === 'active' && o.is_active !== true) return false;
      if (filter === 'inactive' && o.is_active !== false) return false;

      if (!search) return true;
      const q = search.toLowerCase();
      const fullName = `${o.first_name || ''} ${o.last_name || ''}`.toLowerCase();
      return (
        fullName.includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.phone_no?.toLowerCase().includes(q) ||
        o.state?.toLowerCase().includes(q)
      );
    });
  }, [officials, filter, search]);

  const paginatedCards = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredOfficials.slice(start, end);
  }, [filteredOfficials, page, rowsPerPage]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.md || 15, gap: 14 }}>
      <FilterSearchBar
        filter={filter}
        onFilterChange={(f: FilterTab) => { setFilter(f); setPage(0); }}
        search={search}
        onSearchChange={(s: string) => { setSearch(s); setPage(0); }}
        searchPlaceholder="Search officials..."
      />

      {paginatedCards.map((t: any) => {
        const fullName = `${t.first_name || ''} ${t.last_name || ''}`.trim() || 'Unknown Official';

        return (
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
                {fullName}
              </Text>

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
                <Text style={styles.label(theme)}>
                  Status: {t.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>

              <TournamentActions
                tournament={t}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </View>
          </Card>
        );
      })}

      {filteredOfficials.length === 0 && (
        <Text style={{ textAlign: 'center', color: theme.colors.textSecondary, marginTop: 20, fontFamily: theme.typography.fontFamily }}>
          No officials found
        </Text>
      )}

      <Pagination
        total={filteredOfficials.length}
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