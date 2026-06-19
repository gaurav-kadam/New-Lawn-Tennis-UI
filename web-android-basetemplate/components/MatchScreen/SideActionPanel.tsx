
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/themeContext';

const actions = [
  'Goals',
  'Shots',
  'Fouls',
  'Penalty',
  'Bench',
  'Other', 
];

interface SideActionPanelProps {
  teamName: string;
  backgroundColor: string; 
  activeAction: string | null;                
  onActionSelect: (actionName: string) => void; 
}

export default function SideActionPanel({ teamName, backgroundColor, activeAction, onActionSelect }: SideActionPanelProps) {
  const theme = useTheme();

  const isDarkBg = backgroundColor === '#0056B3' || backgroundColor === 'blue' || backgroundColor === theme.colors.primary;
  const textColor = isDarkBg ? '#ffffff' : theme.colors.textPrimary;
  const teamBorderColor = isDarkBg ? '#004085' : theme.colors.border;

  return (
    <View style={styles.sideBarPanelContainer}>
      
     
      <View
        style={[
          styles.teamTextBoxContainer,
          {
            backgroundColor: backgroundColor, 
            borderColor: teamBorderColor,
            borderRadius: theme.radius.sm,
          }
        ]}
      >
        <Text style={[styles.teamText, { color: textColor, fontFamily: theme.typography.fontFamily }]}>
          {teamName}
        </Text>
      </View>

     
      <View style={styles.centerFlexWrapper}>
        <View style={styles.actionButtonGroup}>
          {actions.map((item) => {
            const isButtonActive = activeAction?.toUpperCase() === item.toUpperCase();

            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.7}
                onPress={() => onActionSelect(item)} 
                style={[
                  styles.actionItemButton,
                  {
                    borderColor: isButtonActive ? theme.colors.primary : '#CBD5E1', 
                    borderRadius: theme.radius.sm,
                    backgroundColor: isButtonActive ? '#E2E8F0' : '#FFFFFF', 
                  }
                ]}
              >
                <Text 
                  numberOfLines={1} 
                  adjustsFontSizeToFit 
                  style={[
                    styles.actionButtonText,
                    { 
                      fontWeight: isButtonActive ? '700' : '500',
                      color: isButtonActive ? theme.colors.primary : '#334155',
                      fontFamily: theme.typography.fontFamily,
                    }
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  sideBarPanelContainer: {
    width: 110, 
    height: '100%',
    backgroundColor: '#cfd1d3', 
    alignItems: 'center',
    paddingVertical: 16,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  teamTextBoxContainer: {
    width: 90, 
    height: 52,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  teamText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
  
  centerFlexWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonGroup: { 
    width: '100%', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
  },
  actionItemButton: {
    width: 95, 
    height: 55, 
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionButtonText: { 
    fontSize: 15, 
    letterSpacing: -0.1,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
});
