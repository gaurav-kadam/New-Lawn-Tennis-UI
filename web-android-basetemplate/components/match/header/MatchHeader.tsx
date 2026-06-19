// MatchHeader.tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import Button from '@/components/ui/Button';
import ViewLogModal from './ViewLogModal';
import { useMatch } from '../layout/MatchContext'; 

export default function MatchHeader() {
  const theme = useTheme();
  const [isLogVisible, setIsLogVisible] = useState(false);
  
  const { 
    secondsLeft, 
    isRunning, 
    toggleTimer, 
    formatTime, 
    scoreA, 
    scoreB, 
    currentQuarter, 
    endQuarter,
    getQuarterScore,
    isHubConnected
  } = useMatch();

  const handleEndInning = () => endQuarter();
  const handleEndMatch = () => console.log("End Match pressed");

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
    }}>
      
      {/* ==================== 📊 LEFT SECTION ==================== */}
      <View style={{ flex: 3.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ width: layout.scoreboardWidth, justifyContent: 'center' }}>
          <Text style={{ 
            color: theme.colors.textSecondary, 
            fontSize: sizes.miniLabel, 
            fontWeight: weights.heavy, 
            marginBottom: theme.spacing.xs, 
            letterSpacing: 0.5, 
            textTransform: 'uppercase' 
          }}>Scoreboard</Text>
          
          <View style={{ 
            borderWidth: 1, 
            borderColor: colors.border, 
            borderRadius: theme.radius.sm, 
            overflow: 'hidden', 
            backgroundColor: colors.bg 
          }}>
            {/* Header Row */}
            <View style={{ 
              flexDirection: 'row', 
              backgroundColor: colors.headerBg, 
              borderBottomWidth: 1, 
              borderColor: colors.border, 
              height: layout.scoreboardRowHeight, 
              alignItems: 'center' 
            }}>
              <Text style={{ width: layout.scoreboardHeaderWidth, color: colors.headerText, fontSize: sizes.tableCell, fontWeight: weights.bold, paddingLeft: theme.spacing.sm }}>Quarter</Text>
              {[1, 2, 3, 4].map(q => (
                <Text key={q} style={{ flex: 1, color: theme.colors.textLight, fontSize: sizes.tableCell, fontWeight: weights.bold, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.border }}>{q}</Text>
              ))}
              <Text style={{ flex: 2, color: theme.colors.textLight, fontSize: sizes.tableCell, fontWeight: weights.bold, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.border }}>Total</Text>
            </View>

            {/* Team A Row */}
            <View style={{ 
              flexDirection: 'row', 
              borderBottomWidth: 1, 
              borderColor: colors.border, 
              height: layout.scoreboardRowHeight, 
              alignItems: 'center' 
            }}>
              <Text style={{ width: layout.scoreboardHeaderWidth, color: colors.teamA, fontSize: sizes.tableCell, fontWeight: weights.heavy, paddingLeft: theme.spacing.sm }}>Team A</Text>
              {[1, 2, 3, 4].map(q => (
                <Text key={q} style={{ flex: 1, color: theme.colors.textLight, fontSize: sizes.tableCell, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.border }}>
                  {getQuarterScore('left', q)}
                </Text>
              ))}
              <Text style={{ flex: 2, color: theme.colors.textLight, fontSize: sizes.tableCell, fontWeight: weights.bold, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.border }}>{scoreA}</Text>
            </View>

            {/* Team B Row */}
            <View style={{ flexDirection: 'row', height: layout.scoreboardRowHeight, alignItems: 'center' }}>
              <Text style={{ width: layout.scoreboardHeaderWidth, color: colors.teamB, fontSize: sizes.tableCell, fontWeight: weights.heavy, paddingLeft: theme.spacing.sm }}>Team B</Text>
              {[1, 2, 3, 4].map(q => (
                <Text key={q} style={{ flex: 1, color: theme.colors.textLight, fontSize: sizes.tableCell, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.border }}>
                  {getQuarterScore('right', q)}
                </Text>
              ))}
              <Text style={{ flex: 2, color: theme.colors.textLight, fontSize: sizes.tableCell, fontWeight: weights.bold, textAlign: 'center', borderLeftWidth: 1, borderColor: colors.border }}>{scoreB}</Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text numberOfLines={1} style={{ fontSize: sizes.body, fontWeight: weights.heavy, color: theme.colors.textSecondary }}>Team A</Text>
          <Text style={{ fontSize: sizes.tableCell, color: theme.colors.textSecondary, fontWeight: weights.bold, marginTop: 1, letterSpacing: 0.5 }}>HOME</Text>
        </View>
      </View>

      {/* ==================== 🎯 CENTER HUD ==================== */}
      <View style={{ flex: 3, height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.sm }}>
        <View style={{ 
          flexDirection: 'row', 
          height: layout.hudContainerHeight, 
          width: '100%', 
          borderRadius: theme.radius.sm, 
          overflow: 'hidden', 
          borderWidth: 1, 
          borderColor: theme.colors.border 
        }}>
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.matchScreen.shade1 }}> 
            <Text style={{ fontSize: sizes.scoreHUD, fontWeight: weights.heavy, color: colors.teamA }}>{scoreA}</Text>
          </View>

          <View style={{ 
            flex: 2.2, 
            backgroundColor: theme.colors.matchScreen.sidePanel1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column', 
            gap: layout.hudCenterGap, 
            paddingVertical: theme.spacing.xs 
          }}>
            {/* Realtime Dual Connection Status Indicator */}
            <View style={{ paddingHorizontal: 8, paddingVertical: 1, borderRadius: 4, backgroundColor: isHubConnected ? '#2e7d32' : '#c62828' }}>
              <Text style={{ color: '#ffffff', fontSize: 9, fontWeight: weights.heavy }}>
                {isHubConnected ? "LAN REMOTE LINK ACTIVE" : "LOCAL BACKUP MODE"}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: layout.hudCenterGap + 2, alignItems: 'center' }}>
              <Button icon="document-text-outline" size="sm" onPress={() => setIsLogVisible(true)} />
              <View style={{ 
                paddingHorizontal: theme.spacing.sm, 
                paddingVertical: theme.spacing.xs, 
                justifyContent: 'center', 
                alignItems: 'center', 
                borderColor: theme.colors.primary, 
                borderWidth: 1, 
                borderRadius: theme.radius.sm, 
                minWidth: layout.hudTimeMinWidth 
              }}>
                <Text style={{ color: theme.colors.textPrimary, fontWeight: weights.bold, fontSize: layout.hudTimeFontSize }}>{formatTime(secondsLeft)}</Text>
              </View>
              <Button icon={isRunning ? "pause" : "play"} size="sm" onPress={toggleTimer} />
            </View>
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.matchScreen.shade1 }}> 
            <Text style={{ fontSize: sizes.scoreHUD, fontWeight: weights.heavy, color: colors.teamA }}>{scoreB}</Text>
          </View>
        </View>
      </View>

      {/* ==================== 🏁 RIGHT SECTION ==================== */}
      <View style={{ flex: 3.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text numberOfLines={1} style={{ fontSize: sizes.body, fontWeight: weights.heavy, color: theme.colors.textSecondary }}>Team B</Text>
          <Text style={{ fontSize: sizes.tableCell, color: theme.colors.textSecondary, fontWeight: weights.bold, marginTop: 1, letterSpacing: 0.5 }}>AWAY</Text>
        </View>

        <View style={{ flexDirection: 'column', alignItems: 'center', gap: layout.actionGap, width: 110, height: 60 }}>
          <Button 
            title="End Quarter"
            variant="danger"
            size="sm"
            style={{ flex: 1, borderRadius: theme.radius.sm, borderColor: theme.colors.surface }}
            textStyle={{ fontSize: layout.hudTimeFontSize - 2, fontWeight: weights.bold }}
            onPress={handleEndInning} 
          />
          <Button 
            title="End Match"
            variant="danger"
            size="sm"
            style={{ flex: 1, borderRadius: theme.radius.sm, borderColor: theme.colors.surface }}
            textStyle={{ fontSize: layout.hudTimeFontSize - 2, fontWeight: weights.bold }}
            onPress={handleEndMatch} 
          />
        </View>
      </View>

      <ViewLogModal isVisible={isLogVisible} onClose={() => setIsLogVisible(false)} />
    </View>
  );
}