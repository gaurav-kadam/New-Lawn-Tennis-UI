// MatchScreen.tsx
import React from 'react';
import { View, Platform } from 'react-native';
import MatchHeader from '../../components/match/header/MatchHeader';
import MatchBody from '@/components/match/layout/MatchBody';
import { MatchProvider } from '@/components/match/layout/MatchContext';
import MobileRemote from '../../components/match/remote/MobileRemote'; // Import the mobile remote screen

export default function MatchScreen() {
  // 📱 Check if the app is opening on a phone (iOS or Android)
  const isMobileDevice = Platform.OS === 'android' || Platform.OS === 'ios';

  return (
    <MatchProvider>
      <View style={{ flex: 1 }}>
        {isMobileDevice ? (
          // If it's a mobile phone, show ONLY the clean play/pause button remote control
          <MobileRemote />
        ) : (
          // If it's a laptop/desktop browser, show the full scorer control board
          <>
            <MatchHeader />
            <MatchBody />
          </>
        )}
      </View>
    </MatchProvider>
  );
}