import { Ionicons } from '@expo/vector-icons';
import { Redirect, Stack, Tabs } from 'expo-router';
import { ActivityIndicator, View, useWindowDimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import '../global.css';

import MobileLayout from '../layouts/MobileLayout';
import WebLayout from '../layouts/web/WebLayout';
import { useTheme } from '@/theme/themeContext';

export default function AppLayout() {
  const { isLoggedIn, loading } = useAuth();
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const isMobile = width < 768;

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={theme.colors.primary} />
    </View>;
  }

  // 🔒 AUTH GUARD
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  // 🖥️ WEB → Sidebar Layout + Stack
  if (!isMobile) {
    return (
      <WebLayout>
        <Stack screenOptions={{ headerShown: false }} />
      </WebLayout>
    );
  }

  // 📱 MOBILE → Bottom Tabs
  return (
    <MobileLayout>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,

tabBarStyle: {

      position: 'absolute',

      left: 16,
      right: 16,
      bottom: 16,

      height: 72,

      borderRadius: 24,

      backgroundColor:
        theme.colors.surface,

      borderTopWidth: 0,

      paddingTop: 10,
      paddingBottom: 10,

      elevation: 10,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.12,
      shadowRadius: 10,
    },

    tabBarItemStyle: {
      borderRadius: 18,
      marginHorizontal: 4,
    },

          tabBarIcon: ({ color, size }) => {
            let iconName: any;

            if (route.name === 'dashboard') iconName = 'home';
            else if (route.name === 'tournaments') iconName = 'trophy';
            else if (route.name === 'teams') iconName = 'people';
            else if (route.name === 'officials') iconName = 'shield';
            else if (route.name === 'matches') iconName = 'list';
            else if (route.name === 'settings') iconName = 'person';


            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="dashboard" />
        <Tabs.Screen name="tournaments" />
        <Tabs.Screen name="teams" />
        <Tabs.Screen name="officials" />
        <Tabs.Screen name="matches" />
        <Tabs.Screen name="settings" />
          {/* hidden route */}
  <Tabs.Screen
    name="users"
    options={{
      href: null,
    }}
  />
  <Tabs.Screen
    name="TennisMatchScreen"
    options={{
      href: null,
    }}
  />
      </Tabs>
    </MobileLayout>
  );
}
