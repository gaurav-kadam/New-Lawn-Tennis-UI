import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, View, ActivityIndicator } from 'react-native';

import { useTheme } from '../../../theme/themeContext';
import { useFullscreenStore } from '../../../stores/fullscreen.store';
import { useAuth } from '../../../context/AuthContext';

import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

// 🌟 UPDATED: Everyone has structural access permissions to both match tracking interfaces
const ROLE_PERMISSIONS: Record<string, string[]> = {
  supervisor: ['/dashboard1', '/tournaments', '/teams', '/officials', '/matches', '/MatchScreen', '/users'],
  admin: ['/dashboard1', '/tournaments', '/teams', '/officials', '/matches', '/MatchScreen'], // Added MatchScreen
  scorer: ['/matches', '/MatchScreen'], // 🌟 Added /MatchScreen so scorers can run games smoothly
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
    { name: 'Dashboard', icon: 'home', path: '/dashboard1' },
    { name: 'Tournaments', icon: 'trophy', path: '/tournaments' },
    { name: 'Teams', icon: 'people', path: '/teams' },
    { name: 'Officials', icon: 'shield', path: '/officials' },
    { name: 'Matches', icon: 'list', path: '/matches' },
    { name: 'Match Screen', icon: 'person', path: '/MatchScreen' },
    { name: 'User Management', icon: 'person', path: '/users' },
  ];

  // Extract lowercase role name string safely from context state fallback
  const currentRole = user?.role?.role_name?.toLowerCase() || 'scorer';
  const allowedPaths = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS['scorer'];

  // 1. Dynamic UI Navigation Menu Filtering Logic
  const filteredMenu = masterMenu.filter((item) => allowedPaths.includes(item.path));

  // 2. Immediate Active URL Router Protection Guard Engine
  useEffect(() => {
    if (loading) return;

    // 🌟 OPTIMIZATION: Extract clean base pathname splitting off any search/query routing params (e.g., ?tournament_code=...)
    const baseCleanPath = path.split('?')[0];
    const isPathAllowed = allowedPaths.includes(baseCleanPath);

    if (!isPathAllowed) {
      console.warn(`Unauthorized access attempt to [${baseCleanPath}] rejected for role: ${currentRole}`);
      
      // Dynamic fallbacks on landing destination base entry indexes
      if (currentRole === 'scorer') {
        router.replace('/matches'); // Fallback destination updated for scorers
      } else {
        router.replace('/dashboard1');
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

  return (
    <View style={{ flex: theme.layout.flexFull }}>
      {/* ================= HEADER ================= */}
      {!isFullscreen && (
        <Header onToggle={() => setSidebarOpen(!isSidebarOpen)} theme={theme} />
      )}

      {/* ================= BODY ================= */}
      <View style={{ flex: theme.layout.flexFull, flexDirection: 'row' }}>
        
        {/* ================= SIDEBAR ================= */}
        {!isFullscreen && (
          <Sidebar
            menu={filteredMenu} // Feeds safe filtered collection subset cleanly
            path={path}
            router={router}
            translateX={sidebarTranslate}
            onClose={() => setSidebarOpen(false)}
            theme={theme}
          />
        )}

        {/* ================= CONTENT ================= */}
        <Content marginLeft={isFullscreen ? 0 : contentMargin} theme={theme}>
          {children}
        </Content>
      </View>

      {/* ================= FOOTER ================= */}
      {!isFullscreen && <Footer theme={theme} />}
    </View>
  );
}