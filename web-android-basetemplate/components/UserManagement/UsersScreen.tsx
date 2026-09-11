import { useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;

  // Pulling complete user list to hand off to local visual presentation filters
  const { users: masterUsersList, reload: reloadUsers } = useUsers({});

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