
import { useEffect, useState } from 'react';


import {
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';

import DeleteModal from '../../components/elements/DeleteModal';
import UserModal from '../../components/elements/UserModal';

import UserService from '../../services/users/user.Service';

import { useTheme } from '../../theme/themeContext';

import UserManagementCardList from '@/components/UserManagement/UserManagementCardList';
import UserManagementHeader from '@/components/UserManagement/UserManagementHeader';
import UserManagementTable from '@/components/UserManagement/UserManagementTable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function UsersScreen() {

  const theme = useTheme();
  const router = useRouter();

  const { width: screenWidth } =
    useWindowDimensions();

  const isMobile =
    screenWidth < 768;

  const [users, setUsers] =
    useState<any[]>([]);

    

  // ================= USER MODAL =================

  const [openModal, setOpenModal] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<any>(null);

  // ================= DELETE MODAL =================

  const [deleteModal, setDeleteModal] =
    useState(false);

  useEffect(() => {

  loadUsers();

  const checkAccess = async () => {
    const storedUser =
      await AsyncStorage.getItem('user');

    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    const role =
      user?.role?.role_name ||
      user?.role_name ||
      user?.role;

    if (role !== 'Supervisor') {
      router.replace('/dashboard');
    }
  };

  checkAccess();

}, []);

  // ================= LOAD USERS =================

  const loadUsers = async () => {

    try {

      const response =
        await UserService.getUsers();

      console.log(
        'response',
        response
      );

      setUsers(
        response.data || []
      );

    } catch (error) {

      console.log(error);
    }
  };

  // ================= CREATE USER =================

  const openCreateModal = () => {

    setSelectedUser(null);

    setOpenModal(true);
  };

  // ================= EDIT USER =================

  const openEditModal = (
    item: any
  ) => {

    setSelectedUser(item);

    setOpenModal(true);
  };

  // ================= DELETE USER =================

  const openDeleteModal = (
    item: any
  ) => {

    console.log('DELETE ITEM FROM TABLE:', item);
    
    setSelectedUser(item);

    setDeleteModal(true);
  };

  // ================= CLOSE MODAL =================

  const closeModal = () => {

    setOpenModal(false);

    setSelectedUser(null);
  };

  // ================= CLOSE DELETE =================

  const closeDeleteModal = () => {

    setDeleteModal(false);

    setSelectedUser(null);
  };

  return (

    <>

      <ScrollView
        scrollEnabled={isMobile}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{

          flexGrow: 1,

          padding: isMobile
            ? theme.spacing.md
            : theme.spacing.xl,
        }}
      >

        {/* ================= HEADER ================= */}

        <UserManagementHeader
          onEdit={openCreateModal}
        />

        {/* ================= CONTENT ================= */}

        <View
          style={{

            flex: 1,

            minHeight:
              isMobile
                ? 'auto'
                : 0,
          }}
        >

          {isMobile ? (

            <UserManagementCardList
              tournaments={users}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />

          ) : (

            <View
              style={{

                flex: 1,

                overflow: 'hidden',
              }}
            >

              <UserManagementTable
                tournaments={users}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />

            </View>
          )}

        </View>

      </ScrollView>

      {/* ================= USER MODAL ================= */}

      <UserModal
        visible={openModal}
        selectedUser={selectedUser}
        reload={loadUsers}
        onClose={closeModal}
      />

      {/* ================= DELETE MODAL ================= */}

      <DeleteModal
        visible={deleteModal}
        selectedUser={selectedUser}
        reload={loadUsers}
        onClose={closeDeleteModal}
      />

    </>
  );
}