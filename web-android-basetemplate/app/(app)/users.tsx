import { useEffect, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import DeleteModal from '../../components/elements/DeleteModal';
import UserModal from '../../components/elements/UserModal';

import { useTheme } from '../../theme/themeContext';

import UserManagementCardList from '@/components/UserManagement/UserManagementCardList';
import UserManagementHeader from '@/components/UserManagement/UserManagementHeader';
import UserManagementTable from '@/components/UserManagement/UserManagementTable';
import { useUsers } from '@/hooks/useUsers';
import FilterSearchBar from '@/components/ui/FilterSearchBar';
import type { FilterTab } from '@/components/ui/FilterSearchBar';
import Pagination from '@/components/ui/Pagination';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function UsersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;

  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isActive = filter === 'all' ? undefined : filter === 'active';
  const { users: filteredUsers, total, reload: reloadUsers } = useUsers({
    isActive,
    search,
    page,
    rowsPerPage,
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const role = user?.role?.role_name || user?.role_name || user?.role;
      if (role !== 'Supervisor') {
        router.replace('/dashboard');
      }
    };
    checkAccess();
  }, []);

  const openCreateModal = () => {
    setSelectedUser(null);
    setOpenModal(true);
  };

  const openEditModal = (item: any) => {
    setSelectedUser(item);
    setOpenModal(true);
  };

  const openDeleteModal = (item: any) => {
    console.log('DELETE ITEM FROM TABLE:', item);
    setSelectedUser(item);
    setDeleteModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedUser(null);
  };

  const displayUsers = (filteredUsers || []).filter((u: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.role_name?.toLowerCase().includes(q)
    );
  });

  const topSection = (
    <>
      <UserManagementHeader onEdit={openCreateModal} />
      <FilterSearchBar
        filter={filter}
        onFilterChange={(f: FilterTab) => { setFilter(f); setPage(0); }}
        search={search}
        onSearchChange={(s: string) => { setSearch(s); setPage(0); }}
        searchPlaceholder="Search users..."
      />
    </>
  );

  return (
   
    <View style={{ flex: 1, height: '100vh' as any, overflow: 'hidden' as any, backgroundColor: theme.colors.background }}>
      {isMobile ? (
        /*
         * MOBILE: outer ScrollView + card list — no inner ScrollView conflict.
         */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.md }}
        >
          {topSection}
          <UserManagementCardList
            tournaments={displayUsers}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: theme.spacing.xl }}>
          <View style={{ flexShrink: 0 }}>
            {topSection}
          </View>
          <View style={{ height: 'calc(100vh - 360px)' as any, width: '100%' }}>
            <UserManagementTable
              tournaments={displayUsers}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          </View>
          <Pagination
            total={total ?? 0}
            page={page ?? 0}
            rowsPerPage={rowsPerPage ?? 10}
            onPageChange={setPage}
            onRowsPerPageChange={(rpp: number) => { setRowsPerPage(rpp); setPage(0); }}
          />
        </View>
      )}

      <UserModal
        visible={openModal}
        selectedUser={selectedUser}
        reload={reloadUsers}
        onClose={closeModal}
      />

      <DeleteModal
        visible={deleteModal}
        selectedUser={selectedUser}
        reload={reloadUsers}
        onClose={closeDeleteModal}
      />
    </View>
  );
}
