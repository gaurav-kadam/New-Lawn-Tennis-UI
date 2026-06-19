
import { useEffect, useState } from 'react';
import { getRoles } from '../../services/role/Role.services';
import UserRoleSelect from './UserRoleSelect';

import {
  Modal,
  Text,
  View,
} from 'react-native';

import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

import UserService from '../../services/users/user.Service';

import { useTheme } from '../../theme/themeContext';

type Role = {
  role_id: number;
  role_name: string;
  is_active: boolean;
};

export default function UserModal({
  visible,
  onClose,
  selectedUser,
  reload,
}: any) {

  const theme = useTheme();

  const [loading, setLoading] =
    useState(false);

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [roles, setRoles] =
    useState<Role[]>([]);

  const [roleId, setRoleId] =
    useState('');

  // ================= PREFILL =================

  useEffect(() => {

    if (selectedUser) {

      setName(
        selectedUser.name || ''
      );

      setEmail(
        selectedUser.email || ''
      );

      setPassword('');

    } else {

      resetForm();
    }

  }, [selectedUser]);

  useEffect(() => {

  const loadRoles = async () => {

    try {

        const data = await getRoles();

      console.log('ROLES DATA:', data);
      console.log('ROLES LENGTH:', data?.length);
      if (Array.isArray(data)) {

        setRoles(
          data.filter(
            (role: Role) =>
              role.is_active
          )
        );

      } else {

        console.log(
          'Roles is not array:',
          data
        );
}

    } catch (err) {

      console.log(
        'Roles fetch error:',
        err
      );
    }
  };

  if (visible) {

    loadRoles();
  }

}, [visible]);

  // ================= RESET =================

  const resetForm = () => {

    setName('');

    setEmail('');

    setPassword('');
    setRoleId(
      selectedUser?.role?.role_id
        ? String(selectedUser.role.role_id)
        : ''
    );

    setError('');

    setRoleId('');
  };

  // ================= SUBMIT =================

  const onSubmit = async () => {

    try {

      setError('');

      if (
        !name ||
        !email ||
        !roleId ||
        (!selectedUser && !password)
      ) {

        setError(
          'All fields are required'
        );

        return;
      }

      setLoading(true);

      const payload: any = {

        name,
        email,
        role_id: Number(roleId),
      };

      // only send password if entered

      if (password) {

        payload.password =
          password;
      }

      // ================= UPDATE =================

      if (selectedUser) {

        await UserService.updateUser(
          selectedUser.id,
          payload
        );

      } else {

        // ================= CREATE =================

        await UserService.createUser(
          payload
        );
      }

      await reload();

      handleClose();

    } catch (err: any) {

      console.log(err);

      setError(
        err?.response?.data?.message ||
        'Something went wrong'
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= CLOSE =================

  const handleClose = () => {

    resetForm();

    onClose();
  };

  return (

    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >

      <View
        style={{

          flex: 1,

          justifyContent: 'center',
          alignItems: 'center',

          backgroundColor:
            'rgba(0,0,0,0.45)',

          padding: 20,
        }}
      >

        <Card
          style={{

            width: '100%',

            maxWidth: 500,
            
            maxHeight: '80%',

            padding:
              theme.spacing.xl,
          }}
        >

          {/* ================= HEADER ================= */}

          <View
            style={{

              marginBottom:
                theme.spacing.xl,
            }}
          >

            <Text
              style={{

                fontSize:
                  theme.typography.sizes.h2,

                fontWeight: '800',

                color:
                  theme.colors.textPrimary,
              }}
            >
              {selectedUser
                ? 'Edit User'
                : 'Create User'}
            </Text>

            <Text
              style={{

                marginTop:
                  theme.spacing.xs,

                color:
                  theme.colors.textSecondary,
              }}
            >
              {selectedUser
                ? 'Update user information'
                : 'Create new user account'}
            </Text>

          </View>

          {/* ================= FORM ================= */}

          <View
            style={{
              gap: theme.spacing.lg,
            }}
          >

            <Input
              label="Name"
              placeholder="Enter full name"
              value={name}
              onChangeText={setName}
            />

            <Input
              label="Email"
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              label="Password"
              placeholder={
                selectedUser
                  ? 'Leave empty to keep same password'
                  : 'Enter password'
              }
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={error}
            />

            <UserRoleSelect
              value={roleId}
              onChange={setRoleId}
              roles={roles}
            />                        

            {/* ================= FOOTER ================= */}

            <View
              style={{

                flexDirection: 'row',

                justifyContent:
                  'flex-end',

                gap: theme.spacing.md,

                marginTop:
                  theme.spacing.md,
              }}
            >

              <Button
                title="Cancel"
                variant="ghost"
                icon="close-outline"
                onPress={handleClose}
              />

              <Button
                title={
                  loading
                    ? (
                        selectedUser
                          ? 'Updating...'
                          : 'Creating...'
                      )
                    : (
                        selectedUser
                          ? 'Update User'
                          : 'Create User'
                      )
                }
                icon={
                  selectedUser
                    ? 'create-outline'
                    : 'person-add-outline'
                }
                onPress={onSubmit}
                loading={loading}
              />

            </View>

          </View>

        </Card>

      </View>

    </Modal>
  );
}