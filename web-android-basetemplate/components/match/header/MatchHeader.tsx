// MatchHeader.tsx

import React, { useState, useEffect } from 'react';

import { View, Text, Platform, ViewStyle, TextStyle } from 'react-native';

import { useTheme } from '../../../theme/themeContext';

import Button from '@/components/ui/Button';

import ViewLogModal from './ViewLogModal';

import QuarterConfirmationModal from './QuarterConfirmationModal';

import PenaltyPlayerSelectionModal from './PenaltyPlayerSelectionModal';

import MatchResultModal from './MatchResultModal';

import { useMatch } from '../layout/MatchContext';

import { useLocalSearchParams } from 'expo-router';

import TeamService from '../../../services/team/team.service';



export default function MatchHeader() {

  const theme = useTheme();

  const [isLogVisible, setIsLogVisible] = useState(false);

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const [isPenaltySelectionVisible, setIsPenaltySelectionVisible] = useState(false);

  const [isResultVisible, setIsResultVisible] = useState(false);

 

  const { whiteTeamName, blueTeamName, whiteTeamCode, blueTeamCode } = useLocalSearchParams<{ whiteTeamName?: string; blueTeamName?: string; whiteTeamCode?: string; blueTeamCode?: string }>();

 

  const {

    secondsElapsed,

    isRunning,

    toggleTimer,

    formatTime,

    scoreA,

    scoreB,

    currentQuarter,

    endQuarter,

    getQuarterScore,

    activeMatch,

    penaltyPhase,

    setPenaltyPhase,

    setPenaltyLineup,

    isPenaltyRoundComplete,          

    setIsPenaltyRoundComplete,      

    resetPenaltyOnlyForContinuation

  } = useMatch();



  const displayWhiteTeam = whiteTeamName || activeMatch?.whiteTeamName || 'Team A';

  const displayBlueTeam = blueTeamName || activeMatch?.blueTeamName || 'Team B';

  const resolvedWhiteTeamCode = whiteTeamCode || activeMatch?.whiteTeamCode || activeMatch?.white_team_code || activeMatch?.white_team;

  const resolvedBlueTeamCode = blueTeamCode || activeMatch?.blueTeamCode || activeMatch?.blue_team_code || activeMatch?.blue_team;



  const [whiteShortName, setWhiteShortName] = useState('');

  const [blueShortName, setBlueShortName] = useState('');



  useEffect(() => {

    const fetchShort = async (code: string | undefined): Promise<string> => {

      if (!code) return '';

      try {

        const res = await TeamService.getTeams({ team_code: code });

        const list: any[] = res?.data?.data ?? res?.data ?? (Array.isArray(res) ? res : []);

        const team = list.find((t: any) => String(t.team_code) === String(code));

        return team?.short_name || '';

      } catch {

        return '';

      }

    };

    if (resolvedWhiteTeamCode || resolvedBlueTeamCode) {

      Promise.all([fetchShort(resolvedWhiteTeamCode), fetchShort(resolvedBlueTeamCode)]).then(

        ([ws, bs]) => { setWhiteShortName(ws); setBlueShortName(bs); }

      );

    }

  }, [resolvedWhiteTeamCode, resolvedBlueTeamCode]);



  const scoreboardWhite = whiteShortName || displayWhiteTeam;

  const scoreboardBlue  = blueShortName  || displayBlueTeam;



  const handleEndInning = () => setIsConfirmVisible(true);



  useEffect(() => {

    if (isPenaltyRoundComplete) {

      setIsConfirmVisible(true);

    }

  }, [isPenaltyRoundComplete]);



  const handleConfirmEndQuarter = () => {

    setIsConfirmVisible(false);

   

    if (penaltyPhase) {

      setIsPenaltyRoundComplete(false);

      setIsResultVisible(true);

      return;

    }



    if (currentQuarter === 4) {

      if (scoreA === scoreB) {

        setIsPenaltySelectionVisible(true);

      }

    } else {

      endQuarter();

    }

  };



  const handleForceEndMatch = () => {

    setIsConfirmVisible(false);

    setIsResultVisible(true);

  };



  const layout = theme.layout.header;

  const colors = theme.colors.matchScreen.scoreboard;

  const weights = theme.typography.weights;

  const sizes = theme.typography.sizes;



  return (

    <View style={{

      flexDirection: 'row',

      height: layout.height,

      width: '100%',

      backgroundColor: theme.colors.matchScreen.headerColor,

      alignItems: 'center',

      paddingHorizontal: theme.spacing.md,

    } as ViewStyle}>



   

     

      <View style={{ flex: 3.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } as ViewStyle}>

        <View style={{ width: layout.scoreboardWidth, justifyContent: 'center' } as ViewStyle}>

         

          <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: theme.radius.sm, overflow: 'hidden', backgroundColor: colors.bg } as ViewStyle}>

            <View style={{ flexDirection: 'row', backgroundColor: colors.headerBg, borderBottomWidth: 1, borderColor: colors.border, height: layout.scoreboardRowHeight, alignItems: 'center' } as ViewStyle}>

              <Text style={{ width: layout.scoreboardHeaderWidth, color: colors.headerText, fontSize: sizes.tableCell, fontWeight: weights.bold, paddingLeft: theme.spacing.sm } as TextStyle}>Quarter</Text>

              {[1, 2, 3, 4].map(q => (

                <Text key={q} style={{ flex: 1, color: theme.colors.textLight, fontSize: sizes.tableCell, fontWeight: weights.bold, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.border } as TextStyle}>{q}</Text>

              ))}

              <Text style={{ flex: 2, color: theme.colors.textLight, fontSize: sizes.tableCell, fontWeight: weights.bold, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.border } as TextStyle}>Total</Text>

            </View>



            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border, height: layout.scoreboardRowHeight, alignItems: 'center' } as ViewStyle}>

              <Text numberOfLines={1} style={{ width: layout.scoreboardHeaderWidth, color: colors.team, fontSize: sizes.tableCell, fontWeight: weights.heavy, paddingLeft: theme.spacing.sm } as TextStyle}>{scoreboardWhite}</Text>

              {[1, 2, 3, 4].map(q => (

                <Text key={q} style={{ flex: 1, color: theme.colors.textLight, fontSize: sizes.tableCell, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.border } as TextStyle}>{getQuarterScore('left', q)}</Text>

              ))}

              <Text style={{ flex: 2, color: theme.colors.textLight, fontSize: sizes.tableCell, fontWeight: weights.bold, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.border } as TextStyle}>{scoreA}</Text>

            </View>



            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border, height: layout.scoreboardRowHeight, alignItems: 'center' } as ViewStyle}>

              <Text numberOfLines={1} style={{ width: layout.scoreboardHeaderWidth, color: colors.team, fontSize: sizes.tableCell, fontWeight: weights.heavy, paddingLeft: theme.spacing.sm } as TextStyle}>{scoreboardBlue}</Text>

              {[1, 2, 3, 4].map(q => (

                <Text key={q} style={{ flex: 1, color: theme.colors.textLight, fontSize: sizes.tableCell, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.border } as TextStyle}>{getQuarterScore('right', q)}</Text>

              ))}

              <Text style={{ flex: 2, color: theme.colors.textLight, fontSize: sizes.tableCell, fontWeight: weights.bold, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.border } as TextStyle}>{scoreB}</Text>

            </View>

          </View>

        </View>



        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 } as ViewStyle}>

          <Text numberOfLines={1} style={{ fontSize: sizes.body, fontWeight: weights.heavy, color: theme.colors.surface, textAlign: 'center' } as TextStyle}>{displayWhiteTeam}</Text>

          <Text style={{ fontSize: sizes.tableCell, color: theme.colors.surface, fontWeight: weights.bold, marginTop: 1, letterSpacing: 0.5 } as TextStyle}>WHITE</Text>

        </View>

      </View>



      <View style={{ flex: 3, height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.sm } as ViewStyle}>

        <View style={{ flexDirection: 'row', height: layout.hudContainerHeight, width: '100%', borderRadius: theme.radius.sm, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border } as ViewStyle}>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.secondary } as ViewStyle}>

            <Text style={{ fontSize: sizes.scoreHUD, fontWeight: weights.heavy, color: theme.colors.black } as TextStyle}>{scoreA}</Text>

          </View>



          <View style={{ flex: 2.2, backgroundColor: theme.colors.matchScreen.sidePanel1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: layout.hudCenterGap, paddingVertical: theme.spacing.xs } as ViewStyle}>

            <View style={{ paddingHorizontal: theme.spacing.sm + 4, paddingVertical: 2, borderRadius: theme.radius.sm, borderWidth: 1, borderColor: theme.colors.primary } as ViewStyle}>

              <Text style={{ color: theme.colors.textPrimary, fontSize: sizes.miniLabel, fontWeight: weights.heavy } as TextStyle}>

                {penaltyPhase ? "PENALTY SHOOTOUT" : `Quarter ${currentQuarter}`}

              </Text>

            </View>

           

            <View style={{ flexDirection: 'row', gap: layout.hudCenterGap + 2, alignItems: 'center' } as ViewStyle}>

              <Button icon="document-text-outline" size="sm" backgroundColor="#c53bbe" borderColor="#fcfcfc" onPress={() => setIsLogVisible(true)} />

              <View style={{ paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs, justifyContent: 'center', alignItems: 'center', borderColor: theme.colors.primary, borderWidth: 1, borderRadius: theme.radius.sm, minWidth: layout.hudTimeMinWidth } as ViewStyle}>

                <Text style={{ color: theme.colors.textPrimary, fontWeight: weights.bold, fontSize: layout.hudTimeFontSize } as TextStyle}>{formatTime(secondsElapsed)}</Text>

              </View>

              <Button icon={isRunning ? "pause" : "play"} size="sm" backgroundColor="#c53bbe" borderColor="#fcfcfc" onPress={toggleTimer} />

            </View>

          </View>



          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primary } as ViewStyle}>

            <Text style={{ fontSize: sizes.scoreHUD, fontWeight: weights.heavy, color: theme.colors.black } as TextStyle}>{scoreB}</Text>

          </View>

        </View>

      </View>



      <View style={{ flex: 3.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } as ViewStyle}>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 } as ViewStyle}>

          <Text numberOfLines={1} style={{ fontSize: sizes.body, fontWeight: weights.heavy, color: theme.colors.surface, textAlign: 'center' } as TextStyle}>{displayBlueTeam}</Text>

          <Text style={{ fontSize: sizes.tableCell, color: theme.colors.surface, fontWeight: weights.bold, marginTop: 1, letterSpacing: 0.5 } as TextStyle}>BLUE</Text>

        </View>

       

        {/* End Match button removed, End Quarter button scaled comfortably to fill space */}

        <View style={{ width: 110, height: 42, justifyContent: 'center' } as ViewStyle}>

          <Button title="End Quarter" variant="danger" size="sm" style={{ height: '100%', borderRadius: theme.radius.sm, borderColor: theme.colors.surface } as ViewStyle} textStyle={{ fontSize: layout.hudTimeFontSize - 2, fontWeight: weights.bold } as TextStyle} onPress={handleEndInning} />

        </View>

      </View>



      <ViewLogModal isVisible={isLogVisible} onClose={() => setIsLogVisible(false)} />

     

      <PenaltyPlayerSelectionModal

        isVisible={isPenaltySelectionVisible}

        onClose={() => setIsPenaltySelectionVisible(false)}

        onNext={(lineup) => {

          setPenaltyLineup(lineup);

          setIsPenaltySelectionVisible(false);

          setPenaltyPhase(true);

        }}

        whiteTeamCode={resolvedWhiteTeamCode}

        blueTeamCode={resolvedBlueTeamCode}

        whiteTeamName={displayWhiteTeam}

        blueTeamName={displayBlueTeam}

      />



      <QuarterConfirmationModal

        isVisible={isConfirmVisible}

        onClose={() => {

          setIsConfirmVisible(false);

          if (penaltyPhase) setIsPenaltyRoundComplete(false);

        }}

        onConfirm={handleConfirmEndQuarter}

        onForceEndMatch={handleForceEndMatch}

        currentQuarter={currentQuarter}

        scoreA={scoreA}

        scoreB={scoreB}

        whiteTeamName={displayWhiteTeam}

        blueTeamName={displayBlueTeam}

        timeString={formatTime(secondsElapsed)}

        penaltyPhase={penaltyPhase}

        onContinuePenalty={() => {

          resetPenaltyOnlyForContinuation();

          setIsConfirmVisible(false);

        }}

      />



      <MatchResultModal

        isVisible={isResultVisible}

        onClose={() => setIsResultVisible(false)}

        scoreA={scoreA}

        scoreB={scoreB}

        whiteTeamName={displayWhiteTeam}

        blueTeamName={displayBlueTeam}

        whiteTeamCode={resolvedWhiteTeamCode}

        blueTeamCode={resolvedBlueTeamCode}

        getQuarterScore={getQuarterScore}

      />

    </View>

  );

}

