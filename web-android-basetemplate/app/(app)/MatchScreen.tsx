// MatchScreen.tsx
import MatchBody from '@/components/match/layout/MatchBody';
import { MatchProvider, useMatch } from '@/components/match/layout/MatchContext';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import MatchHeader from '../../components/match/header/MatchHeader';
import { useLocalSearchParams } from 'expo-router'; // 🌟 Import route hook

// 🌟 Inner Wrapper Component to handle state syncing safely within provider boundaries
function MatchScreenContent() {
  const { setActiveMatch } = useMatch();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.matchId) {
      // Build a basic match entity to populate state tracking safely
      setActiveMatch({
        id: params.matchId,
        white_team: params.whiteTeamName,
        blue_team: params.blueTeamName,
        whiteTeamName: params.whiteTeamName,
        blueTeamName: params.blueTeamName,
        whiteTeamCode: params.whiteTeamCode,
        blueTeamCode: params.blueTeamCode,
        white_team_code: params.whiteTeamCode,
        blue_team_code: params.blueTeamCode,
      });
    }
  }, [params.matchId, params.whiteTeamName, params.blueTeamName, params.whiteTeamCode, params.blueTeamCode, setActiveMatch]);

  return (
    <>
      <MatchHeader />
      <MatchBody />
    </>
  );
}

export default function MatchScreen() {
  const isBrowserWindow = typeof document !== 'undefined';

  useEffect(() => {
    if (isBrowserWindow) {
      const enterFullScreen = async () => {
        try {
          const docEl = document.documentElement;
          if (docEl.requestFullscreen) await docEl.requestFullscreen();
        } catch {
          console.log("Browser blocked automatic full screen initialization.");
        }
      };
      enterFullScreen();
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) => console.log(err));
        }
      };
    }
  }, [isBrowserWindow]);

  return (
    <MatchProvider>
      <View style={{ flex: 1, backgroundColor: '#121212' }}>
        <MatchScreenContent />
      </View>
    </MatchProvider>
  );
}
