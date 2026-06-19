

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface SubMenuOverlayProps {
  actionName: 'GOALS' | 'SHOTS' | 'FOULS' | 'PENALTY' | 'BENCH' | 'OTHER' | string; // Main active button category
  onClear: () => void; 
  onSelectOption?: (option: string) => void; // Callback channel for active card selections
  positionStyle: { left?: number; right?: number };
}


const OPTION_REGISTRY: Record<string, string[]> = {
  'GOALS': ['ACTION', 'CENTER', '6M', '6MFT', 'COUNTER ATTACK', 'EXTRA PLAYER'],
  'SHOTS': ['ACTION', 'CENTER', '6M', '6MFT', 'COUNTER ATTACK', 'EXTRA PLAYER'],
  'FOULS': ['CENTER', 'FIELD', 'DOUBLE', 'EXCLUSION', 'BRUTALITY'],
  'PENALTY': ['PEN GOAL', 'PEN SAVE', 'PEN MISSED', 'PEN SHOT'],
  'BENCH': ['YELLOW CARD', 'RED CARD', 'YELLOW TEAM', 'CHALLENGE'],
  'OTHER': ['SPRINTER WON', 'STEAL', 'TURN OVER FOUL', 'CORNER'], 
};

export default function SubMenuOverlay({ 
  actionName, 
  onClear, 
  onSelectOption,
  positionStyle 
}: SubMenuOverlayProps) {

 
  const normalizedKey = actionName.toUpperCase();
  const activeOptions = OPTION_REGISTRY[normalizedKey] || ['NO OPTIONS AVAILABLE'];

  const handleOptionPress = (option: string) => {
    if (onSelectOption) {
      onSelectOption(option);
    }
    console.log(`[${normalizedKey}] Option Selected: ${option}`);
  };

  return (
    <View style={[styles.containerOverlay, positionStyle]}>
      
     
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {normalizedKey}
          </Text>
        </View>
      </View>

     
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentLayout}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {activeOptions.map((btnLabel, index) => (
            <TouchableOpacity 
              key={`${btnLabel}-${index}`} 
              activeOpacity={0.7}
              onPress={() => handleOptionPress(btnLabel)}
              style={styles.gridActionCard}
            >
              <Text style={styles.actionCardText} numberOfLines={2}>
                {btnLabel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          activeOpacity={0.85}
          onPress={onClear}
          style={styles.confirmActionButton}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerOverlay: {
    position: 'absolute',
    top: 220,                  
    width: 300,                
    height: 360, 
    backgroundColor: '#CBD5E1',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#94A3B8', 
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,              
    zIndex: 50,                
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderColor: '#94A3B8', 
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF', 
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#0F2547', 
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentLayout: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
  },
  gridActionCard: {
    width: '48%', 
    height: 54,                      
    backgroundColor: '#FFFFFF', 
    borderRadius: 10,                   
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    paddingHorizontal: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  actionCardText: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: '#1E293B', 
    textAlign: 'center',
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#94A3B8',
  },
  confirmActionButton: {
    height: 46,                        
    backgroundColor: '#0F2547', 
    borderRadius: 10,                   
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
