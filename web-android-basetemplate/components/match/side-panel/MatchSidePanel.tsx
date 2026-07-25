 // MatchSidePanel.tsx

import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import Button from '../../ui/Button'; 
import ActionPopupCard from './ActionPopupCard'; 
import { useMatch } from '../layout/MatchContext'; 

interface MatchSidePanelProps {
  side: 'left' | 'right';
}

export default function MatchSidePanel({ side }: MatchSidePanelProps) {
  const theme = useTheme();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const { selectedPlayer } = useMatch(); 

  const actions = [
    { label: 'Goals', icon: 'football-outline' },
    { label: 'Shots', icon: 'aperture-outline' },
    { label: 'Fouls', icon: 'alert-circle-outline' },
    { label: 'Penalty', icon: 'warning-outline' },
    { label: 'Card', icon: 'people-outline' },
    { label: 'Other', icon: 'ellipsis-horizontal-outline' },
    { label: 'Coach', icon: 'person-circle-outline' },
  ];
  

  const isLeft = side === 'left';
  const buttonTextColor = isLeft ? theme.colors.primary : theme.colors.secondary;
  const buttonBorderColor = isLeft ? theme.colors.primary : theme.colors.secondary;
  const buttonBgColor = isLeft ? theme.colors.secondary : theme.colors.primary;

  const handleActionPress = (actionLabel: string) => {
    // Escape hatch bypass constraint: Skip selectedPlayer validation rules if selecting Coach actions
    if (actionLabel !== 'Coach' && (!selectedPlayer || selectedPlayer.side !== side)) {
      Alert.alert(
        "Selection Required", 
        `Please select a player from Team ${isLeft ? 'A' : 'B'} before tracking an action.`
      );
      return;
    }
    setSelectedAction(selectedAction === actionLabel ? null : actionLabel);
  };

  // Composite gap utility matching token system configurations cleanly inline
  const compositeGapValue = theme.spacing.sm + theme.spacing.xs;

  return (
    <View style={{
      flex: theme.layout.flexFull, 
      maxWidth: theme.layout.sidePanelWidth, 
      position: 'relative', 
      overflow: 'visible', 
      zIndex: 10, 
      elevation: theme.shadow.medium.elevation * theme.layout.elevationMultiplier,
    }}> 
    
      <View style={{
        flex: 1, 
        backgroundColor: theme.colors.matchScreen.sidePanel1, 
        justifyContent: 'center', 
        alignItems: 'center',  
        gap: compositeGapValue, 
        overflow: 'visible',
      }}>
        {actions.map((action) => (
          <Button
            key={action.label}
            title={action.label}
            icon={action.icon}
            variant="outline"
            textColor={buttonTextColor}
            borderColor={buttonBorderColor}
            backgroundColor={buttonBgColor}
            onPress={() => handleActionPress(action.label)}
            style={{
              width: theme.layout.actionButtonWidth, 
              height: theme.layout.actionButtonHeight, 
              flexDirection: 'column', 
              gap: theme.spacing.xs,
            }}
          />
        ))}
      </View>

      <ActionPopupCard 
        selectedAction={selectedAction} 
        onClose={() => setSelectedAction(null)} 
        side={side} 
      />
    </View>
  );
}