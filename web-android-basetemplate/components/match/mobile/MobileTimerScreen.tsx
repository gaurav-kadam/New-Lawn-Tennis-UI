import React, { useEffect, useState } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import Button from '../../ui/Button';
import { useMatch, PenaltyLineup } from '../layout/MatchContext';
import QuarterConfirmationModal from '../header/QuarterConfirmationModal';
import PenaltyPlayerSelectionModal from '../header/PenaltyPlayerSelectionModal';
import MatchResultModal from '../header/MatchResultModal';

interface MobileTimerScreenProps {
  whiteTeamName: string;
  blueTeamName: string;
  whiteTeamCode?: string;
  blueTeamCode?: string;
}

export default function MobileTimerScreen({
  whiteTeamName,
  blueTeamName,
  whiteTeamCode,
  blueTeamCode,
}: MobileTimerScreenProps) {
  const theme = useTheme();

  const {
    secondsElapsed,
    isRunning,
    quarterDurationSeconds,
    currentQuarter,
    scoreA,
    scoreB,
    activeMatch,
    penaltyPhase,
    isPenaltyRoundComplete,
    setIsPenaltyRoundComplete,
    resetPenaltyOnlyForContinuation,
    startTimer,
    pauseTimer,
    resetTimer,
    endQuarter,
    setPenaltyPhase,
    setPenaltyLineup,
    formatTime,
    getQuarterScore,
  } = useMatch();

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isPenaltySelectionVisible, setIsPenaltySelectionVisible] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);

  useEffect(() => {
    if (isPenaltyRoundComplete) {
      setIsConfirmVisible(true);
    }
  }, [isPenaltyRoundComplete]);

  const handleEndQuarter = () => setIsConfirmVisible(true);

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
      } else {
        setIsResultVisible(true);
      }
    } else {
      endQuarter();
    }
  };

  const handleForceEndMatch = () => {
    setIsConfirmVisible(false);
    setIsResultVisible(true);
  };

  const progressPercent =
    quarterDurationSeconds > 0
      ? Math.min(secondsElapsed / quarterDurationSeconds, 1)
      : 0;

  const remainingSeconds = Math.max(quarterDurationSeconds - secondsElapsed, 0);

  const BG = '#121212';
  const CARD_BG = '#1e1e1e';
  const BORDER = '#2a2a2a';
  const TEXT_PRIMARY = '#f1f5f9';
  const TEXT_SECONDARY = '#94a3b8';
  const ACCENT = theme.colors.primary || '#3b82f6';
  const DANGER = theme.colors.error || '#ef4444';

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>

      {/* ── Top info bar ───────────────────────────────────────────── */}
      <View style={{
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
        gap: 4,
      } as ViewStyle}>
        <Text style={{ color: TEXT_SECONDARY, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase' } }>
          Match {activeMatch?.match_no || '—'}
        </Text>
        <Text style={{ color: TEXT_PRIMARY, fontSize: 15, fontWeight: '700' }} numberOfLines={1}>
          {whiteTeamName} (W)  vs  {blueTeamName} (B)
        </Text>
      </View>

      {/* ── Quarter badge ──────────────────────────────────────────── */}
      <View style={{ alignItems: 'center', paddingTop: 28 }}>
        <View style={{
          paddingHorizontal: 16,
          paddingVertical: 5,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: ACCENT,
          backgroundColor: `${ACCENT}18`,
        }}>
          <Text style={{ color: ACCENT, fontSize: 13, fontWeight: '700', letterSpacing: 0.8 }}>
            {penaltyPhase ? 'PENALTY SHOOTOUT' : `QUARTER  ${currentQuarter}  /  4`}
          </Text>
        </View>
      </View>

      {/* ── Main clock ─────────────────────────────────────────────── */}
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 36, paddingBottom: 20 }}>
        <Text style={{
          fontSize: 88,
          fontWeight: '900',
          color: TEXT_PRIMARY,
          fontVariant: ['tabular-nums'] as any,
          letterSpacing: -2,
        } }>
          {formatTime(secondsElapsed)}
        </Text>
        <Text style={{ color: TEXT_SECONDARY, fontSize: 13, marginTop: 4 }}>
          {formatTime(remainingSeconds)} remaining
        </Text>
      </View>

      {/* ── Progress bar ───────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 28, paddingBottom: 36 }}>
        <View style={{ height: 6, backgroundColor: BORDER, borderRadius: 3, overflow: 'hidden' }}>
          <View style={{
            width: `${progressPercent * 100}%` as any,
            height: '100%',
            backgroundColor: progressPercent >= 1 ? DANGER : ACCENT,
            borderRadius: 3,
          }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={{ color: TEXT_SECONDARY, fontSize: 11 } as TextStyle}>{formatTime(0)}</Text>
          <Text style={{ color: TEXT_SECONDARY, fontSize: 11 } as TextStyle}>{formatTime(quarterDurationSeconds)}</Text>
        </View>
      </View>

      {/* ── Primary timer control ──────────────────────────────────── */}
      <View style={{ paddingHorizontal: 24, gap: 14 } }>
        <Button
          title={isRunning ? '⏸  Pause Clock' : '▶  Start Clock'}
          variant={isRunning ? 'outline' : 'primary'}
          onPress={isRunning ? pauseTimer : startTimer}
          style={{ height: 62, borderRadius: 14 }}
          textStyle={{ fontSize: 20, fontWeight: '800' } }
        />

        <View style={{ flexDirection: 'row', gap: 12 } }>
          <Button
            title="Reset Clock"
            variant="ghost"
            onPress={resetTimer}
            style={{ flex: 1, height: 48, borderWidth: 1, borderColor: BORDER, borderRadius: 10,backgroundColor:'#faca50' }}
            textStyle={{ fontSize: 14 }}
          />
          <Button
            title="End Quarter"
            variant="danger"
            onPress={handleEndQuarter}
            style={{ flex: 1, height: 48, borderRadius: 10 } }
            textStyle={{ fontSize: 14 } }
          />
        </View>
      </View>

      {/* ── Quarter scoreboard ─────────────────────────────────────── */}
      <View style={{
        marginHorizontal: 24,
        marginTop: 32,
        backgroundColor: CARD_BG,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDER,
        overflow: 'hidden',
      } }>
        {/* Header row */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: BORDER, backgroundColor: '#252525' } }>
          <View style={{ width: 90, paddingVertical: 8, paddingLeft: 12 } }>
            <Text style={{ color: TEXT_SECONDARY, fontSize: 11, fontWeight: '600' } }>Quarter</Text>
          </View>
          {[1, 2, 3, 4].map((q) => (
            <View key={q} style={{ flex: 1, alignItems: 'center', paddingVertical: 8, borderLeftWidth: 1, borderColor: BORDER } }>
              <Text style={{ color: TEXT_SECONDARY, fontSize: 11, fontWeight: '600' } }>{q}</Text>
            </View>
          ))}
          <View style={{ flex: 1.5, alignItems: 'center', paddingVertical: 8, borderLeftWidth: 1, borderColor: BORDER } }>
            <Text style={{ color: TEXT_SECONDARY, fontSize: 11, fontWeight: '600' } }>Total</Text>
          </View>
        </View>

        {/* White row */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: BORDER } }>
          <View style={{ width: 90, paddingVertical: 10, paddingLeft: 12 }}>
            <Text style={{ color: '#93c5fd', fontSize: 12, fontWeight: '700' } } numberOfLines={1}>WHITE</Text>
          </View>
          {[1, 2, 3, 4].map((q) => (
            <View key={q} style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderLeftWidth: 1, borderColor: BORDER } }>
              <Text style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: '600' } }>{getQuarterScore('left', q)}</Text>
            </View>
          ))}
          <View style={{ flex: 1.5, alignItems: 'center', paddingVertical: 10, borderLeftWidth: 1, borderColor: BORDER } }>
            <Text style={{ color: '#93c5fd', fontSize: 16, fontWeight: '900' } }>{scoreA}</Text>
          </View>
        </View>

        {/* Blue row */}
        <View style={{ flexDirection: 'row' } }>
          <View style={{ width: 90, paddingVertical: 10, paddingLeft: 12 } }>
            <Text style={{ color: '#fbbf24', fontSize: 12, fontWeight: '700' }} numberOfLines={1}>BLUE</Text>
          </View>
          {[1, 2, 3, 4].map((q) => (
            <View key={q} style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderLeftWidth: 1, borderColor: BORDER }}>
              <Text style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: '600' } }>{getQuarterScore('right', q)}</Text>
            </View>
          ))}
          <View style={{ flex: 1.5, alignItems: 'center', paddingVertical: 10, borderLeftWidth: 1, borderColor: BORDER }}>
            <Text style={{ color: '#fbbf24', fontSize: 16, fontWeight: '900' }}>{scoreB}</Text>
          </View>
        </View>
      </View>

      {/* ── Modals (same flow as MatchHeader) ─────────────────────── */}
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
        whiteTeamName={whiteTeamName}
        blueTeamName={blueTeamName}
        timeString={formatTime(secondsElapsed)}
        penaltyPhase={penaltyPhase}
        onContinuePenalty={() => {
          resetPenaltyOnlyForContinuation();
          setIsConfirmVisible(false);
        }}
      />

      <PenaltyPlayerSelectionModal
        isVisible={isPenaltySelectionVisible}
        onClose={() => setIsPenaltySelectionVisible(false)}
        onNext={(lineup: PenaltyLineup) => {
          setPenaltyLineup(lineup);
          setIsPenaltySelectionVisible(false);
          setPenaltyPhase(true);
        }}
        whiteTeamCode={whiteTeamCode}
        blueTeamCode={blueTeamCode}
        whiteTeamName={whiteTeamName}
        blueTeamName={blueTeamName}
      />

      <MatchResultModal
        isVisible={isResultVisible}
        onClose={() => setIsResultVisible(false)}
        scoreA={scoreA}
        scoreB={scoreB}
        whiteTeamName={whiteTeamName}
        blueTeamName={blueTeamName}
        whiteTeamCode={whiteTeamCode}
        blueTeamCode={blueTeamCode}
        getQuarterScore={getQuarterScore}
      />
    </View>
  );
}
