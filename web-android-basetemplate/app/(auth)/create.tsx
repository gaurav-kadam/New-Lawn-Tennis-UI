import React, { useState } from 'react';

import {
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';


import { useTheme } from '../../theme/themeContext';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import UserService from '../../services/users/user.Service';

export default function CreateUserScreen() {

  const theme = useTheme();

  const router = useRouter();

  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {

    try {

      setError('');

      if (
        !name ||
        !email ||
        !password
      ) {

        setError(
          'All fields are required'
        );

        return;
      }

      setLoading(true);

      await UserService.createUser({
        name,
        email,
        password,
      });

      router.back();

    } catch (err: any) {

      console.log(
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ||
        'Failed to create user'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,

        backgroundColor:
          theme.colors.background,

        padding: theme.spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >

      <View
        style={{
          flex: 1,

          justifyContent: 'center',
          alignItems: 'center',
        }}
      >

        <Card
          style={{
            width: '100%',

            maxWidth: 500,

            padding: theme.spacing.xl,
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
              Create User
            </Text>

            <Text
              style={{
                marginTop:
                  theme.spacing.xs,

                color:
                  theme.colors.textSecondary,
              }}
            >
              Add new user account
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
              placeholder="Enter password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={error}
            />

            <Button
              title={
                loading
                  ? 'Creating User...'
                  : 'Create User'
              }
              icon="person-add-outline"
              onPress={handleCreateUser}
            />

            <Button
              title="Cancel"
              variant="outline"
              icon="close-outline"
              onPress={() =>
                router.back()
              }
            />

          </View>

        </Card>

      </View>

    </ScrollView>
  );
}