import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../theme/themeContext';

export default function WebLayout({ children }: any) {
  const router = useRouter();
  const path = usePathname();
  const theme = useTheme();

  const sidebarWidth = 220;

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // 🔥 animation value (0 → closed, 1 → open)
  const anim = useRef(new Animated.Value(1)).current;

  const menu = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Tab 1', path: '/tab1' },
    { name: 'Tab 2', path: '/tab2' },
    { name: 'Users', path: '/users' }
    
  ];

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isSidebarOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: false, // needed for layout (margin)
    }).start();
  }, [isSidebarOpen]);

  // 🔥 derived animations
  const sidebarTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-sidebarWidth, 0],
  });

  const contentMargin = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, sidebarWidth],
  });

  return (
    <View style={{ flex: 1 }}>

      {/* ================= HEADER ================= */}
      <View
        style={{
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          zIndex: 10,
        }}
      >
        <TouchableOpacity onPress={() => setSidebarOpen(!isSidebarOpen)}>
          <Text style={{ fontSize: 18 }}>☰</Text>
        </TouchableOpacity>

        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: theme.typography.sizes.h3,
         }}
        >
          My App
        </Text>

        <View />
      </View>

      {/* ================= BODY ================= */}
      <View style={{ flex: 1, flexDirection: 'row' }}>

        {/* ================= SIDEBAR ================= */}
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: sidebarWidth,
            backgroundColor: theme.colors.surface,
            padding: 20,
            borderRightWidth: 1,
            borderColor: theme.colors.border,
            transform: [{ translateX: sidebarTranslate }],
            zIndex: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => setSidebarOpen(false)}
            style={{ marginBottom: 20 }}
          >
            <Text style={{ color: theme.colors.primary }}>Close ✕</Text>
          </TouchableOpacity>

          {menu.map((item) => (
            <TouchableOpacity
              key={item.path}
              onPress={() => {
                router.replace(item.path);
              }}
              style={{
                padding: 12,
                marginBottom: 8,
                borderRadius: 8,
                backgroundColor:
                  path === item.path
                    ? theme.colors.primary
                    : 'transparent',
              }}
            >
              <Text
                style={{
                  color:
                    path === item.path
                      ? '#fff'
                      : theme.colors.textPrimary,
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* ================= CONTENT ================= */}
        <Animated.View
          style={{
            flex: 1,
            marginLeft: contentMargin, // 🔥 push effect
          }}
        >
          <ScrollView
            contentContainerStyle={{
              padding: theme.spacing.md,
              backgroundColor: theme.colors.background,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>

      {/* ================= FOOTER ================= */}
      <View
        style={{
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          borderTopWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        }}
      >
        <Text style={{ color: theme.colors.textSecondary }}>
          © 2026 Your Company
        </Text>
      </View>
    </View>
  );
}