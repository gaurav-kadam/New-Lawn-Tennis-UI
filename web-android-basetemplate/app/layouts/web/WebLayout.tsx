import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, ActivityIndicator, Alert, Platform } from 'react-native';

import { useTheme } from '../../../theme/themeContext';
import { useFullscreenStore } from '../../../stores/fullscreen.store';
import { useAuth } from '../../../context/AuthContext';

import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  supervisor: [
    '/dashboard',
    '/tournaments',
    '/teams',
    '/players',
    '/officials', 
    '/matches',
    '/MatchScreen',
    '/TennisMatchScreen',
    '/users',
  ],

  admin: [
    '/dashboard',
    '/tournaments',
    '/teams',
    '/players',
    '/officials',
    '/matches',
    '/MatchScreen',
    '/TennisMatchScreen',
  ],

  scorer: [
    '/matches',
    '/MatchScreen',
    '/TennisMatchScreen',
  ],
};
export default function WebLayout({ children }: any) {
  const router = useRouter();
  const path = usePathname();
  const theme = useTheme();
  const { user, loading } = useAuth();
  const { isFullscreen } = useFullscreenStore();

  const sidebarWidth = 220;
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const anim = useRef(new Animated.Value(1)).current;

  // Global static menu layout manifest master registration
  const masterMenu = [
    { name: 'Dashboard', icon: 'home', path: '/dashboard' },
    { name: 'Tournaments', icon: 'trophy', path: '/tournaments' },
    { name: 'Teams', icon: 'people', path: '/teams' },
    { name: 'Players', icon: 'people', path: '/players' },
    { name: 'Officials', icon: 'shield', path: '/officials' },
    { name: 'Matches', icon: 'list', path: '/matches' },
    { name: 'User Management', icon: 'person', path: '/users' },
  ];

  
  const currentRole = user?.role?.role_name?.toLowerCase() || 'scorer';
  const allowedPaths = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS['scorer'];

  // 1. Dynamic UI Navigation Menu Filtering Logic
  const filteredMenu = masterMenu.filter((item) => allowedPaths.includes(item.path));

  // Extract clean base pathname splitting off any search/query routing params
  const baseCleanPath = path.split('?')[0];
  
  // Guard condition to check if user is on the dedicated Match Tracking Interface
  const isMatchScreen =
    baseCleanPath === '/MatchScreen' ||
    baseCleanPath === '/TennisMatchScreen';

  // 2. Active URL Protection Guard & Action Interceptor Engine
  useEffect(() => {
    if (loading) return;

    // // 🌟 RETAINED INTERCEPTOR: If admin/supervisor attempts to enter the Match Tracking Screen, block and alert them
    // if (isMatchScreen && (currentRole === 'admin' || currentRole === 'supervisor')) {
      
    //   // Multi-platform safe clean alert invocation
    //   if (Platform.OS === 'web') {
    //     window.alert('Access Denied: Only a Scorer can start and track matches.');
    //   } else {
    //     Alert.alert('Access Denied', 'Only a Scorer can start and track matches.');
    //   }

    //   // Explicitly redirect them right back to the static matches panel view without flickering/blinking
    //   router.replace('/matches');
    //   return;
    // }

    // Standard structural path fallback security mechanism
    const isPathAllowed = allowedPaths.includes(baseCleanPath);
    if (!isPathAllowed) {
      console.warn(`Unauthorized access attempt to [${baseCleanPath}] rejected for role: ${currentRole}`);
      
      if (currentRole === 'scorer') {
        router.replace('/matches');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [path, currentRole, loading]);

  // Sidebar animations sequence control block
  useEffect(() => {
    Animated.timing(anim, {
      toValue: isSidebarOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isSidebarOpen]);

  const sidebarTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-sidebarWidth, 0],
  });

  const contentMargin = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, sidebarWidth],
  });

  // Display clean fallback engine spinner while checking context token sessions
  if (loading) {
    return (
      <View style={{ flex: theme.layout.flexFull, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Process tree layout structure and share currentRole down to sub-screens cleanly
  const processedChildren = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, { currentRole })
    : children;

  return (
    <View style={{ flex: theme.layout.flexFull }}>
      
      {/*  HEADER */}
      {!isFullscreen && !isMatchScreen && (
        <Header onToggle={() => setSidebarOpen(!isSidebarOpen)} theme={theme} />
      )}

      {/*  BODY  */}
      <View style={{ flex: theme.layout.flexFull, flexDirection: 'row' }}>
        
        {/* SIDEBAR */}
        {!isFullscreen && !isMatchScreen && (
          <Sidebar
            menu={filteredMenu}
            path={path}
            router={router}
            translateX={sidebarTranslate}
            onClose={() => setSidebarOpen(false)}
            theme={theme}
          />
        )}

        {/* CONTENT */}
        <Content marginLeft={(isFullscreen || isMatchScreen) ? 0 : contentMargin} theme={theme}>
          {processedChildren}
        </Content>
      </View>

      {/*  FOOTER  */}
      {!isFullscreen && !isMatchScreen && <Footer theme={theme} />}
    </View>
  );
}