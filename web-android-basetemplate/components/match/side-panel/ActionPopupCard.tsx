// ActionPopupCard.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import Button from '../../ui/Button';
import { useMatch } from '../layout/MatchContext';

const POPUP_ACTIONS: Record<string, string[]> = {
  Goals: ['Action Goal', 'Extra Man Goal', 'Penalty Goal', 'Counter Goal', '6M Goal', 'Self Goal'],
  Shots: ['Shot Blocked(GK)', 'Shot Blocked(P)', 'Shot Wide', 'Shot Bar'],
  Fouls: ['Ordinary Foul', 'Exclusion Foul', 'Misconduct Foul', 'Brutality Foul', 'Simulating', 'Penalty Foul'],
  Penalty: ['Penalty Awarded', 'Penalty Missed', 'Penalty Saved'],
  Card: ['Yellow Card', 'Red Card', 'Challenge'],
  Other: ['Sprinter Won', 'Steal', 'Turn Over Foul', 'Corner'], 
  Coach: ['Yellow Card', 'Red Card', 'Timeout'],
};

// 🎯 Distinct Icon Definitions for Every Sub-Button Action
const ACTION_ICONS: Record<string, string> = {
  // Goals
  'Action Goal': 'football-outline',
  'Extra Man Goal': 'people-outline',
  'Penalty Goal': 'disc-outline',
  'Counter Goal': 'flash-outline',
  '6M Goal': 'analytics-outline',

  // Shots
  'Shot Blocked(GK)': 'hand-left-outline',
  'Shot Blocked(P)': 'shield-half-outline',
  'Shot Wide': 'trending-down-outline',
  'Shot Bar': 'git-commit-outline',

  // Fouls
  'Ordinary Foul': 'alert-circle-outline',
  'Exclusion Foul': 'exit-outline',
  'Misconduct Foul': 'warning-outline',
  'Brutality Foul': 'thunderstorm-outline',
  'Simulating': 'eye-off-outline',
  'Penalty Foul': 'close-circle-outline',

  // Penalty
  'Penalty Awarded': 'ribbon-outline',
  'Penalty Missed': 'trending-down-outline',
  'Penalty Saved': 'checkmark-circle-outline',

  // Card
  'Yellow Card': 'square',
  'Red Card': 'square',
  'Challenge': 'help-circle-outline',

  // Other
  'Sprinter Won': 'speedometer-outline',
  'Steal': 'hand-left-outline',
  'Turn Over Foul': 'refresh-outline',
  'Corner': 'arrow-redo-outline',

  // Coach
  'Timeout': 'time-outline',
};

interface ActionPopupCardProps {
  selectedAction: string | null;
  onClose: (finalSelection?: string | null) => void;
  side?: 'left' | 'right';
}

export default function ActionPopupCard({ selectedAction, onClose, side = 'left' }: ActionPopupCardProps) {
  const theme = useTheme();
  
  const [displayAction, setDisplayAction] = useState<string | null>(null);
  const [selectedSubAction, setSelectedSubAction] = useState<string | null>(null);
  
  const { addLog } = useMatch();
  
  const cardWidth = theme.layout.popupCard.width;
  const slideAnim = useRef(new Animated.Value(cardWidth)).current;

  useEffect(() => {
    if (selectedAction) {
      setDisplayAction(selectedAction);
      setSelectedSubAction(null); 
      
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: cardWidth,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setDisplayAction(null);
        setSelectedSubAction(null);
      });
    }
  }, [selectedAction, slideAnim, cardWidth]);

  if (!displayAction || !POPUP_ACTIONS[displayAction]) return null;

  const isLeftPanel = side === 'left';
  const hasSubSelection = !!selectedSubAction;

  const translateX = isLeftPanel 
    ? Animated.multiply(slideAnim, -1) 
    : slideAnim;

  const subActions = POPUP_ACTIONS[displayAction] || [];
  const pairedActions: string[][] = [];
  for (let i = 0; i < subActions.length; i += 2) {
    pairedActions.push(subActions.slice(i, i + 2));
  }

  const handleConfirmPress = () => {
    if (selectedSubAction) {
      addLog(selectedSubAction); 
      onClose(selectedSubAction); 
    }
  };

  return (
    <Animated.View 
      style={{
        position: 'absolute',
        top: '25%',          
        width: theme.layout.popupCard.width,
        height: 'auto',              
        zIndex: -1,                  
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: theme.layout.popupCard.borderWidth,
        padding: theme.spacing.sm,
        paddingVertical: theme.spacing.md,                
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: theme.shadow.medium.elevation,
        transform: [{ translateX }],
        
        left: isLeftPanel ? '100%' : undefined,
        right: !isLeftPanel ? '100%' : undefined,
        borderTopRightRadius: isLeftPanel ? theme.radius.lg : undefined,
        borderBottomRightRadius: isLeftPanel ? theme.radius.lg : undefined,
        borderTopLeftRadius: !isLeftPanel ? theme.radius.lg : undefined,
        borderBottomLeftRadius: !isLeftPanel ? theme.radius.lg : undefined,
      }}
    >
      <Text style={{
        fontSize: theme.typography.sizes.small,              
        fontWeight: theme.typography.weights.heavy as '800',
        textAlign: 'center',
        marginBottom: theme.spacing.sm,            
        textTransform: 'uppercase',
        color: theme.colors.textPrimary,
      }}>
        {displayAction}
      </Text>
      
      <View style={{ width: '100%', gap: theme.spacing.xs }}>
        {pairedActions.map((pair, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row', width: '100%', gap: theme.spacing.xs }}>
            {pair.map((subAction) => {
              const isCurrentSelection = selectedSubAction === subAction;
              
              // Select the dynamic mapped icon or fall back gracefully
              const subButtonIcon = ACTION_ICONS[subAction] || 'ellipse-outline';
              
              return (
                <View key={subAction} style={{ flex: theme.layout.flexFull, height: theme.layout.popupCard.subActionHeight }}>
                  <Button
                    title={subAction}
                    size="sm"
                    variant="primary"
                    icon={subButtonIcon}
                    iconPosition="left"
                    backgroundColor={isCurrentSelection ? theme.colors.textPrimary : theme.colors.primary}
                    textColor={theme.colors.secondary}
                    style={{
                      width: '100%',
                      height: '100%',        
                      justifyContent: 'center', 
                      alignItems: 'center',
                      borderRadius: theme.radius.sm,
                      paddingHorizontal: theme.spacing.xs,
                      borderWidth: isCurrentSelection ? theme.layout.popupCard.selectedBorderWidth : undefined,
                      borderColor: isCurrentSelection ? theme.colors.surface : undefined,
                    }} 
                    textStyle={{
                      flex: theme.layout.flexFull, 
                      fontSize: theme.typography.sizes.badge, 
                      fontWeight: theme.typography.weights.medium,
                      textAlign: 'center', 
                      textAlignVertical: 'center',
                      lineHeight: 12,
                      color: isCurrentSelection ? theme.colors.surface : undefined,
                    }}
                    onPress={() => setSelectedSubAction(subAction)} 
                  />
                </View>
              );
            })}
            
            {pair.length === 1 && <View style={{ flex: theme.layout.flexFull, height: theme.layout.popupCard.subActionHeight }} />}
          </View>
        ))}
        
        <View style={{ width: '100%', height: theme.layout.popupCard.confirmButtonHeight, marginTop: theme.spacing.xs }}>
          <Button
            title="Confirm"
            size="sm"
            variant="primary" 
            disabled={!selectedSubAction} 
            onPress={handleConfirmPress}
            backgroundColor={theme.colors.accent}
            textColor={theme.colors.secondary}
            style={{
              width: '100%',
              height: '100%',        
              justifyContent: 'center', 
              alignItems: 'center',
              borderRadius: theme.radius.sm,
              paddingHorizontal: theme.spacing.xs,
              opacity: hasSubSelection ? 1.0 : theme.layout.popupCard.disabledOpacity,
            }}
            textStyle={{
              flex: theme.layout.flexFull,
              fontSize: theme.typography.sizes.badge,
              fontWeight: theme.typography.weights.bold,
              textAlign: 'center', 
              textAlignVertical: 'center',
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
}