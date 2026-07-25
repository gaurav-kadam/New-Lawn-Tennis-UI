// import { Text, View } from 'react-native';

// import Card from '../ui/Card';
// import { useTheme } from '@/theme/themeContext';
// import TournamentActions from './UserManagementActions';

// export default function UserManagementCardList({
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
import TournamentActions from './UserManagementActions';
import FilterSearchBar from '@/components/ui/FilterSearchBar';
import type { FilterTab } from '@/components/ui/FilterSearchBar';
import Pagination from '@/components/ui/Pagination';

export default function UserManagementCardList({
  users = [],
  onEdit,
  onDelete,
}: any) {
  const theme = useTheme();

  // Internal visual segmentation states 
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => {
      if (filter === 'active' && u.role?.is_active !== true) return false;
      if (filter === 'inactive' && u.role?.is_active !== false) return false;

      if (!search) return true;
      const q = search.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.role_name?.toLowerCase().includes(q)
      );
    });
  }, [users, filter, search]);

  const paginatedCards = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, page, rowsPerPage]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.md || 15, gap: 14 }}>
      <FilterSearchBar
        filter={filter}
        onFilterChange={(f: FilterTab) => { setFilter(f); setPage(0); }}
        search={search}
        onSearchChange={(s: string) => { setSearch(s); setPage(0); }}
        searchPlaceholder="Search users..."
      />

      {paginatedCards.map((user: any) => (
        <Card key={user.id} variant="elevated">
          <View style={{ padding: 16, gap: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              {user.name || 'Unknown User'}
            </Text>

            <View style={{ gap: 6 }}>
              <Text style={styles.label(theme)}>
                Email: {user.email || '—'}
              </Text>
              <Text style={styles.label(theme)}>
                Role: {user.role?.role_name || '—'}
              </Text>
              <Text style={styles.label(theme)}>
                Status: {user.role?.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>

            <TournamentActions
              tournament={user}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </View>
        </Card>
      ))}

      {filteredUsers.length === 0 && (
        <Text style={{ textAlign: 'center', color: theme.colors.textSecondary, marginTop: 20, fontFamily: theme.typography.fontFamily }}>
          No users found
        </Text>
      )}

      <Pagination
        total={filteredUsers.length}
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