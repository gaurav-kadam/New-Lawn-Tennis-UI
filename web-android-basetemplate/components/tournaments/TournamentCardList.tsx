// import { Text, View } from 'react-native';

// import Card from '../ui/Card';
// import { useTheme } from '@/theme/themeContext';
// import TournamentActions from './TournamentActions';

// export default function TournamentCardList({
//   tournaments,
//   onEdit,
//   onDelete,
// }: any) {
//   const theme = useTheme();

//   return (
//     <View style={{ gap: 14 }}>
//       {tournaments.map((t: any) => (
//         <Card key={t.id} variant="elevated">
//           <View style={{ padding: 16, gap: 12 }}>

//             <Text
//               style={{
//                 fontSize: 18,
//                 fontWeight: '700',
//                 color: theme.colors.textPrimary,
//                 fontFamily: theme.typography.fontFamily,
//               }}
//             >
//               {t.tournament_name}
//             </Text>

//             <View style={{ gap: 6 }}>
//               <Text style={styles.label(theme)}>
//                 Start: {t.start_date || '—'}
//               </Text>

//               <Text style={styles.label(theme)}>
//                 End: {t.end_date || '—'}
//               </Text>

//               <Text style={styles.label(theme)}>
//                 Section: {t.section || '—'}
//               </Text>

//               <Text style={styles.label(theme)}>
//                 Gender: {t.gender || '—'}
//               </Text>
//             </View>

//             <TournamentActions
//               tournament={t}
//               onEdit={onEdit}
//               onDelete={onDelete}
//             />
//           </View>
//         </Card>
//       ))}
//     </View>
//   );
// }

// const styles = {
//   label: (theme: any) => ({
//     fontSize: 14,
//     color: theme.colors.textSecondary,
//     fontFamily: theme.typography.fontFamily,
//   }),
// };


import React, { useState, useMemo } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Card from '../ui/Card';
import { useTheme } from '@/theme/themeContext';
import TournamentActions from './TournamentActions';
import FilterSearchBar, { FilterTab } from '@/components/ui/FilterSearchBar';
import Pagination from '@/components/ui/Pagination';

export default function TournamentCardList({
  tournaments = [],
  onEdit,
  onDelete,
  onView,
  onAttach
}: any) {
  const theme = useTheme();

  // Mobile local state filters
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t: any) => {
      if (filter === 'active' && t.is_active !== true) return false;
      if (filter === 'inactive' && t.is_active !== false) return false;

      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.tournament_name?.toLowerCase().includes(q) ||
        t.city?.toLowerCase().includes(q) ||
        t.state?.toLowerCase().includes(q) ||
        t.section?.toLowerCase().includes(q) ||
        t.gender?.toLowerCase().includes(q)
      );
    });
  }, [tournaments, filter, search]);

  const paginatedCards = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredTournaments.slice(start, end);
  }, [filteredTournaments, page, rowsPerPage]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.md || 15, gap: 14 }}>
      <FilterSearchBar
        filter={filter}
        onFilterChange={(f: FilterTab) => { setFilter(f); setPage(0); }}
        search={search}
        onSearchChange={(s: string) => { setSearch(s); setPage(0); }}
        searchPlaceholder="Search tournaments..."
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
              <Text style={styles.label(theme)}>
                Status: {t.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>

            <TournamentActions
              tournament={t}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onAttach={onAttach}
            />
          </View>
        </Card>
      ))}

      {filteredTournaments.length === 0 && (
        <Text style={{ textAlign: 'center', color: theme.colors.textSecondary, marginTop: 20 }}>
          No tournaments found
        </Text>
      )}

      <Pagination
        total={filteredTournaments.length}
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