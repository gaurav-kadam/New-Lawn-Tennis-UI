// QuarterConfirmationModal.tsx
import React from 'react';
import { View, Text, Modal } from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import Card from '../../ui/Card'; 
import Button from '../../ui/Button'; 

interface QuarterConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onForceEndMatch: () => void; // New callback
  currentQuarter: number;
  scoreA: number;
  scoreB: number;
  whiteTeamName: string;
  blueTeamName: string;
  timeString: string;
  penaltyPhase?: boolean;
  onContinuePenalty?: () => void; 
}

export default function QuarterConfirmationModal({
  isVisible,
  onClose,
  onConfirm,
  onForceEndMatch,
  currentQuarter,
  scoreA,
  scoreB,
  whiteTeamName,
  blueTeamName,
  timeString,
  penaltyPhase = false,
  onContinuePenalty,
}: QuarterConfirmationModalProps) {
  const theme = useTheme();

  const isTie = scoreA === scoreB;

  const getWinnerString = () => {
    if (scoreA > scoreB) return `${whiteTeamName} (WHITE) Wins!`;
    if (scoreB > scoreA) return `${blueTeamName} (BLUE) Wins!`;
    return "Match is a Draw!";
  };

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: theme.colors.overlay || 'rgba(15, 23, 42, 0.75)', justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg }}>
        <View style={{ width: '100%', maxWidth: 420 }}>
          <Card variant="elevated">
            <View style={{ alignItems: 'center', width: '100%' }}>
              
              <Text style={{ color: theme.colors.error, fontSize: theme.typography.sizes.badge, fontWeight: theme.typography.weights.heavy as any, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: theme.spacing.xs }}>
                {penaltyPhase ? "Penalty Round Concluded" : isTie && currentQuarter === 4 ? "Tie Match Detected" : "End Quarter Confirmation"}
              </Text>
              
              <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.h3, fontWeight: theme.typography.weights.bold as any, textAlign: 'center', marginBottom: theme.spacing.lg }}>
                {penaltyPhase 
                  ? (isTie ? "Score is equal. Do you want to continue penalty shootout?" : `Penalty Round Complete.\nResult: ${getWinnerString()}`)
                  : (isTie && currentQuarter === 4 ? "Score is equal. Do you want to start penalty?" : `Are you sure you want to end Quarter ${currentQuarter}?`)
                }
              </Text>

              {/* Score Display Area */}
              <View style={{ backgroundColor: theme.colors.secondary, width: '100%', borderRadius: theme.radius.sm, paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.lg, alignItems: 'center' }}>
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.caption, fontWeight: theme.typography.weights.medium as any, marginBottom: theme.spacing.sm }}>
                  TOTAL SCORE
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.small, fontWeight: '700', textAlign: 'center' }}>{whiteTeamName}</Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.miniLabel, fontWeight: '600', marginTop: 2 }}>WHITE</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing.sm }}>
                    <Text style={{ fontSize: theme.typography.sizes.h1, fontWeight: '900', color: theme.colors.textPrimary }}>{scoreA}</Text>
                    <Text style={{ fontSize: theme.typography.sizes.h2, fontWeight: '700', color: theme.colors.border, marginHorizontal: theme.spacing.sm }}>—</Text>
                    <Text style={{ fontSize: theme.typography.sizes.h1, fontWeight: '900', color: theme.colors.textPrimary }}>{scoreB}</Text>
                  </View>

                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.small, fontWeight: '700', textAlign: 'center' }}>{blueTeamName}</Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.miniLabel, fontWeight: '600', marginTop: 2 }}>BLUE</Text>
                  </View>
                </View>
              </View>

              {/* Layout Button Selection Blocks */}
              <View style={{ flexDirection: 'column', gap: theme.spacing.sm, width: '100%' }}>
                <View style={{ flexDirection: 'row', gap: theme.spacing.sm, width: '100%' }}>
                  {penaltyPhase && isTie ? (
                    <>
                      <Button title="No" variant="ghost" onPress={onClose} backgroundColor={theme.colors.border} textColor={theme.colors.textSecondary} style={{ flex: 1 }} />
                      <Button title="Yes" variant="danger" onPress={onContinuePenalty} style={{ flex: 1 }} />
                    </>
                  ) : penaltyPhase && !isTie ? (
                    <Button title="Close and Show Results" variant="danger" onPress={onConfirm} style={{ flex: 1 }} />
                  ) : (
                    <>
                      <Button title={(currentQuarter === 4 && isTie) ? "No" : "Cancel"} variant="ghost" onPress={onClose} backgroundColor={theme.colors.border} textColor={theme.colors.textSecondary} style={{ flex: 1 }} />
                      <Button title={(currentQuarter === 4 && isTie) ? "Yes" : "End Quarter"} variant="danger" onPress={onConfirm} style={{ flex: 1 }} />
                    </>
                  )}
                </View>

                {/* Shared "End Match" Escape Button across every variation panel */}
                <Button 
                  title="End Match" 
                  variant="ghost" 
                  onPress={onForceEndMatch} 
                  backgroundColor="rgba(239, 68, 68, 0.1)" 
                  textColor={theme.colors.error} 
                  style={{ width: '100%', borderWidth: 1, borderColor: theme.colors.error }} 
                />
              </View>

            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
}