import React from 'react';

import {
  View,
  Text,
  ScrollView,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

import { useTheme } from '@/theme/themeContext';

import { useAuth } from '@/context/AuthContext';

export default function SettingsScreen() {

  const theme = useTheme();

  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: 'Profile',
      icon: 'person-outline',
    },
    {
      title: 'Tournament Settings',
      icon: 'trophy-outline',
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
    },
    {
      title: 'Theme',
      icon: 'color-palette-outline',
    },
    {
      title: 'About App',
      icon: 'information-circle-outline',
    },
  ];

  return (

    <ScrollView
      contentContainerStyle={{
        padding: theme.spacing.lg,
        gap: theme.spacing.lg,

        backgroundColor:
          theme.colors.background,
      }}
    >

      {/* ================= USER CARD ================= */}

      <Card>

        <View
          style={{
            alignItems: 'center',
          }}
        >

          <View
            style={{
              width: 90,
              height: 90,

              borderRadius: 999,

              backgroundColor:
                theme.colors.primary,

              justifyContent: 'center',
              alignItems: 'center',

              marginBottom:
                theme.spacing.md,
            }}
          >

            <Ionicons
              name="person"
              size={42}
              color="#FFFFFF"
            />

          </View>

          <Text
            style={{
              fontSize: theme.typography.sizes.h2,
              fontWeight: '800',

              color:
                theme.colors.textPrimary,
            }}
          >
            {user?.name || 'Guest User'}
          </Text>

          <Text
            style={{
              marginTop: 4,

              color:
                theme.colors.textSecondary,
            }}
          >
            {user?.email}
          </Text>

        </View>

      </Card>

      {/* ================= MENU ================= */}

      <Card>

        <View
          style={{
            gap: theme.spacing.md,
          }}
        >

          {menuItems.map((item, index) => (

            <View
              key={index}
              style={{
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'space-between',

                paddingVertical:
                  theme.spacing.sm,

                borderBottomWidth:
                  index !== menuItems.length - 1
                    ? 1
                    : 0,

                borderColor:
                  theme.colors.border,
              }}
            >

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',

                  gap: theme.spacing.md,
                }}
              >

                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={
                    theme.colors.primary
                  }
                />

                <Text
                  style={{
                    fontSize:
                      theme.typography.sizes.body,

                    color:
                      theme.colors.textPrimary,
                  }}
                >
                  {item.title}
                </Text>

              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={
                  theme.colors.textSecondary
                }
              />

            </View>
          ))}

        </View>

      </Card>

      {/* ================= LOGOUT ================= */}

      <Button
        title="Logout"
        variant="danger"
        icon="log-out-outline"
        onPress={logout}
      />

    </ScrollView>
  );
}