import { useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

import DeleteModal from '../../components/elements/DeleteModal';
import UserModal from '../../components/elements/UserModal';
import { useTheme } from '../../theme/themeContext';
import { tokens } from '../../theme/token';

import UserManagementCardList from '@/components/UserManagement/UserManagementCardList';
import UserManagementHeader from '@/components/UserManagement/UserManagementHeader';
import UserManagementTable from '@/components/UserManagement/UserManagementTable';
import { useUsers } from '@/hooks/useUsers';

export default function UsersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const canAccess = !authLoading && isLoggedIn && user?.role?.role_name?.toLowerCase() === 'supervisor';
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;

  // Pulling complete user list to hand off to local visual presentation filters
  const { users: masterUsersList, reload: reloadUsers } = useUsers({ enabled: canAccess });

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !canAccess) {
      router.replace('/dashboard');
    }
  }, [authLoading, canAccess, router]);

  const openCreateModal = () => {
    setSelectedUser(null);
    setOpenModal(true);
  };

  const openEditModal = (item: any) => {
    setSelectedUser(item);
    setOpenModal(true);
  };

  const openDeleteModal = (item: any) => {
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

  if (!canAccess) return null;

  return (
    <View style={{ flex: 1, height: '100vh' as any, overflow: 'hidden' as any, backgroundColor: theme.colors.background }}>
      <View style={{ paddingHorizontal: isMobile ? tokens.spacing.md : tokens.spacing.xl, paddingTop: 15, flexShrink: 0 }}>
        <UserManagementHeader onEdit={openCreateModal} />
      </View>

      {isMobile ? (
        <UserManagementCardList
          users={masterUsersList || []}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      ) : (
        <UserManagementTable
          users={masterUsersList || []}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
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