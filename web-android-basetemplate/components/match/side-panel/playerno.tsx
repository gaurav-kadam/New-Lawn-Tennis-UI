import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import Button from '@/components/ui/Button';
import { useMatch } from '../layout/MatchContext'; 

interface PlayerNoProps {
  side: 'left' | 'right';
}

export default function PlayerNo({ side }: PlayerNoProps) {
  const playerNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
  const theme = useTheme();
  const isLeft = side === 'left';

  const { selectedPlayer, selectPlayer, clearSelection, addLog } = useMatch();

  // Tracks disabled players and their individual remaining countdown seconds
  const [disabledCooldowns, setDisabledCooldowns] = useState<Record<string, number>>({});
  
  // Tracks tap intervals to identify explicit double tap events
  const lastTapRef = useRef<Record<string, number>>({});
  const timerRef = useRef<any>(null);

  // Single internal interval clock that runs updates down the active list every second
  useEffect(() => {
    const hasActiveCooldowns = Object.keys(disabledCooldowns).length > 0;

    if (hasActiveCooldowns && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setDisabledCooldowns((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((playerNum) => {
            if (updated[playerNum] <= 1) {
              delete updated[playerNum]; // Restore player when countdown hits zero
            } else {
              updated[playerNum] -= 1; // Decrement countdown value
            }
          });
          return updated;
        });
      }, 1000);
    } else if (!hasActiveCooldowns && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (!hasActiveCooldowns && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [disabledCooldowns]);

  // Clean up timers on unmount safely
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePlayerPress = (playerNum: string) => {
    if (disabledCooldowns[playerNum] !== undefined) return;

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; 
    const lastTap = lastTapRef.current[playerNum] || 0;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // 🚨 DOUBLE TAP REGISTERED: Trigger exclusions dynamic countdown records
      setDisabledCooldowns((prev) => ({ ...prev, [playerNum]: 20 }));
      
      // Dynamic inline entry injection mapping core timeline engine metadata parameters directly
      addLog('Exclusion Foul', side, '----------', playerNum);
      
      if (selectedPlayer?.number === playerNum && selectedPlayer?.side === side) {
        clearSelection();
      }
      
      delete lastTapRef.current[playerNum];
    } else {
      // SINGLE TAP REGISTERED: Trigger standard select match event pipeline
      lastTapRef.current[playerNum] = now;
      selectPlayer(playerNum, side);
    }
  };

  return (
    <View style={{
      width: theme.layout.playerBadge.containerWidth, 
      height: '100%',
      backgroundColor: theme.colors.matchScreen.sidePanel1, 
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
    }}>
      <View style={{
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%',
        gap: theme.layout.playerBadge.stackRowGap,
      }}>
        {playerNumbers.map((item) => {
          const cooldownSeconds = disabledCooldowns[item];
          const isButtonDisabled = cooldownSeconds !== undefined;
          const isCurrentSelected = selectedPlayer?.number === item && selectedPlayer?.side === side;

          // Color calculations including disabled conditional states
          let buttonTextColor = isCurrentSelected 
            ? theme.colors.surface 
            : (isLeft ? theme.colors.primary : theme.colors.secondary);
            
          let buttonBgColor = isCurrentSelected 
            ? theme.colors.textPrimary 
            : (isLeft ? theme.colors.secondary : theme.colors.primary);

          if (isButtonDisabled) {
            buttonTextColor = theme.colors.textSecondary;
            buttonBgColor = theme.colors.border; 
          }

          const renderButtonContent = (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ 
                color: buttonTextColor, 
                fontSize: theme.typography.sizes.playerNumber, 
                fontWeight: theme.typography.weights.bold as '700',
                lineHeight: 14
              }}>
                {item}
              </Text>
              {isButtonDisabled && (
                <Text style={{ 
                  color: theme.colors.textSecondary, 
                  fontSize: theme.typography.sizes.cooldownTimer, 
                  fontWeight: theme.typography.weights.medium as '500',
                  marginTop: theme.layout.playerBadge.cooldownSpacing,
                  lineHeight: 10
                }}>
                  {cooldownSeconds}s
                </Text>
              )}
            </View>
          );

          return (
            <View key={`${side}-player-${item}`} style={{
              height: theme.layout.playerBadge.buttonSize, 
              borderRadius: theme.radius.md, 
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Button
                title={renderButtonContent as any} 
                size="sm"
                variant={isCurrentSelected ? "default" : "outline"}
                textColor={buttonTextColor} 
                borderColor={isButtonDisabled ? theme.colors.border : (isLeft ? theme.colors.primary : theme.colors.secondary)}
                backgroundColor={buttonBgColor} 
                disabled={isButtonDisabled}
                style={{
                  width: theme.layout.playerBadge.buttonSize,  
                  height: theme.layout.playerBadge.buttonSize, 
                  opacity: isButtonDisabled ? theme.layout.playerBadge.disabledOpacity : theme.layout.playerBadge.activeOpacity, 
                  paddingVertical: 0,          
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handlePlayerPress(item)} 
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}