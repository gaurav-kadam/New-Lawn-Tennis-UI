// MatchScreen.tsx
import MatchBody from '@/components/match/layout/MatchBody';
import { MatchProvider, useMatch } from '@/components/match/layout/MatchContext';
import MobileTimerScreen from '../../components/match/mobile/MobileTimerScreen';
import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import MatchHeader from '../../components/match/header/MatchHeader';
import { useLocalSearchParams } from 'expo-router';
import MatchFullscreenButton from '../../components/match/controls/MatchFullscreenButton';
// Double check this path matches your design system config!

const MOBILE_BREAKPOINT = 768;


// Inner wrapper: reads context + params once; routes to mobile or web layout via explicit props.
function MatchScreenContent() {
  const { setActiveMatch } = useMatch();
  const [isFullscreen,setIsFullscreen]=useState(false);
  const params = useLocalSearchParams<{
    matchId?: string;
    whiteTeamName?: string;
    blueTeamName?: string;
    whiteTeamCode?: string;
    blueTeamCode?: string;
    matchDate?: string;
    matchNo?: string;
    gender?: string;
    courtNo?: string;
    tournamentCode?: string;
    quarterDuration?: string;
    digitalScorerCode?: string;
    referee1Code?: string;
    referee2Code?: string;
    timekeeper1Code?: string;
    timekeeper2Code?: string;
    goalJudge1Code?: string;
    goalJudge2Code?: string;
    autoFullscreen?: string;
  }>();

  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  // Derive display values once so they can flow down as explicit props to either layout.
  const displayWhiteTeam = params.whiteTeamName || 'Team A';
  const displayBlueTeam  = params.blueTeamName  || 'Team B';
  const resolvedWhiteCode = params.whiteTeamCode || 'Team A';
  const resolvedBlueCode  = params.blueTeamCode  || 'Team B';

  // Synchronize layout tracking
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement); 
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (typeof document === 'undefined') return;

    try {
      if (!document.fullscreenElement) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen toggle failed", err);
    }
  };

  // ◄ 2. NEW EFFECT: Auto-trigger fullscreen if user arrived via the "Start" button
  useEffect(() => {
    if (!isMobile && params.autoFullscreen === 'true') {
      // Small timeout ensures the DOM is fully ready to handle the transition
      const timer = setTimeout(() => {
        toggleFullscreen();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [params.autoFullscreen, isMobile]);

  useEffect(() => {
    if (params.matchId) {
      setActiveMatch({
        id: params.matchId,
        white_team: displayWhiteTeam,
        blue_team: displayBlueTeam,
        whiteTeamName: displayWhiteTeam,
        blueTeamName: displayBlueTeam,
        whiteTeamCode: resolvedWhiteCode,
        blueTeamCode: resolvedBlueCode,
        white_team_code: resolvedWhiteCode,
        blue_team_code: resolvedBlueCode,
        match_date: params.matchDate,
        match_no: params.matchNo,
        gender: params.gender,
        court_no: params.courtNo,
        tournament_code: params.tournamentCode,
        quarter_duration: params.quarterDuration || '',
        digital_scorer_code: params.digitalScorerCode || '',
        referee_1_code: params.referee1Code || '',
        referee_2_code: params.referee2Code || '',
        timekeeper_1_code: params.timekeeper1Code || '',
        timekeeper_2_code: params.timekeeper2Code || '',
        goaljudge_1_code: params.goalJudge1Code || '',
        goaljudge_2_code: params.goalJudge2Code || '',
      });
    }
  }, [
    params.matchId, params.whiteTeamName, params.blueTeamName,
    params.whiteTeamCode, params.blueTeamCode, params.quarterDuration,
    params.digitalScorerCode, params.referee1Code, params.referee2Code,
    params.timekeeper1Code, params.timekeeper2Code,
    params.goalJudge1Code, params.goalJudge2Code,
    setActiveMatch,
  ]);

  

  //Mobile  viewport → dedicated timekeeper screen
  if (isMobile) {
    return (
      <MobileTimerScreen
        whiteTeamName={displayWhiteTeam}
        blueTeamName={displayBlueTeam}
        whiteTeamCode={resolvedWhiteCode}
        blueTeamCode={resolvedBlueCode}
      />
    );
  }

  //Web / Tablet viewport → full scorer dashboard
  return (
    <>
      <MatchHeader />
      <MatchBody />

      {/* <MatchFullscreenButton
      isFullscreen = {isFullscreen}
      onPress={toggleFullscreen}
      /> */}
    </>
  );
}

export default function MatchScreen() {
  

  useEffect(() => {
      return () => {
        if ( typeof document !== 'undefined' && document.fullscreenElement) {
          document.exitFullscreen().catch((err) => console.log(err));
        }
      };
  
  }, []);

  return (
    <MatchProvider>
      <View style={{ flex: 1, backgroundColor: '#121212' }}>
        <MatchScreenContent />
      </View>
    </MatchProvider>
  );
}
