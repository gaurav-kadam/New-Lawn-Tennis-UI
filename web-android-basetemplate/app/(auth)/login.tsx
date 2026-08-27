// import { useRouter } from 'expo-router';
// import { Text, View } from 'react-native';
// import Button from '../../components/ui/Button';
// import { useAuth } from '../../hooks/fake_auth';

// export default function Login() {
//   const router = useRouter();
//   const { login } = useAuth();

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
//       <Text>Login Screen</Text>

//       <Button
//         title="GO TO DASHBOARD"
//         onPress={() => {
//           login(); // ✅ set flag
//           router.replace('/dashboard'); // ✅ go inside app
//         }}
//       />
//     </View>
//   );
// }
import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';


import {
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

import { useTheme } from '../../theme/themeContext';

import { useAuth } from '../../context/AuthContext';

export default function Login() {

  const theme = useTheme();

  const router = useRouter();

  const { login } = useAuth();

  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    try {

      setError('');

      if (!username || !password) {

        setError('Please enter credentials');

        return;
      }

      setLoading(true);

      await login(
        username,
        password
      );

      if (loading) {

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}

      router.replace('/dashboard');

    } catch (err: any) {

      console.log(err?.response?.data);

      setError(
        err?.response?.data?.message ||
        'Login failed'
      );

    } finally {

      setLoading(false);
    }
  };

  const createUser =  () => {
console.log('hey working');
 router.push('./create')
  };



  return (

    <View
      style={{
        flex: 1,

        flexDirection: isMobile
          ? 'column'
          : 'row',

        backgroundColor: theme.colors.background,
      }}
    >

      {/* ================= LEFT BRANDING ================= */}

      {!isMobile && (

        <View
          style={{
            flex: 1.2,

            backgroundColor: '#082F49',

            justifyContent: 'center',
            alignItems: 'center',

            padding: theme.spacing.xl,
          }}
        >

          <Text
            style={{
              fontSize: 52,
              fontWeight: '900',

              color: '#FFFFFF',
            }}
          >
            WATERPOLO
          </Text>

          <Text
            style={{
              marginTop: theme.spacing.md,

              color: '#BAE6FD',

              fontSize: 20,

              textAlign: 'center',

              maxWidth: 360,

              lineHeight: 30,
            }}
          >
            Professional Match Operations
            and Tournament Management
          </Text>

        </View>
      )}

      {/* ================= LOGIN PANEL ================= */}

      <View
        style={{
          flex: 1,

          justifyContent: 'center',
          alignItems: 'center',

          padding: theme.spacing.lg,
        }}
      >

        <Card
          style={{
            width: '100%',
            maxWidth: 420,

            padding: theme.spacing.xl,
          }}
        >

          {/* MOBILE TITLE */}

          {isMobile && (

            <View
              style={{
                alignItems: 'center',

                marginBottom: theme.spacing.xl,
              }}
            >

              <Text
                style={{
                  fontSize: 38,
                  fontWeight: '900',

                  color: theme.colors.primary,
                }}
              >
                WATERPOLO
              </Text>

            </View>
          )}

          {/* HEADER */}

          <View
            style={{
              marginBottom: theme.spacing.xl,
            }}
          >

            <Text
              style={{
                fontSize: theme.typography.sizes.h2,
                fontWeight: '800',

                color: theme.colors.textPrimary,
              }}
            >
              Welcome Back
            </Text>

            <Text
              style={{
                marginTop: theme.spacing.xs,

                color: theme.colors.textSecondary,
              }}
            >
              Login to continue match operations
            </Text>

          </View>

          {/* FORM */}

          <View
            style={{
              gap: theme.spacing.lg,
            }}
          >

            <Input
              label="Username"
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
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
                  ? 'Logging in...'
                  : 'Login'
              }
              icon="log-in-outline"
              onPress={handleLogin}
            />

            <Button
              title="Create Account"
              variant="outline"
              icon="person-add-outline"
              onPress={createUser}
            />

          </View>

        </Card>

      </View>

    </View>
  );
}