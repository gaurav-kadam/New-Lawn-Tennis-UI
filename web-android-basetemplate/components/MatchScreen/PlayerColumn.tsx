

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/themeContext';
import PlayerCircle from './PlayerCircle';

interface PlayerColumnProps {
  onViewLogSelect: () => void; 
}

export default function PlayerColumn({ onViewLogSelect }: PlayerColumnProps) {
  const theme = useTheme();

 
  const leftPlayers = [2, 4, 3, 4, 5, 9, 12];
  const rightPlayers = [4, 1, 6, 8, 9, 10, 13];

  return (
    <View >
      
     
      <View >
        
        {/* LEFT PLAYERS COLUMN (White Team) */}
        <View >
          {leftPlayers.map((item, index) => {
            const isGoalkeeper = index === 0;
            return (
              <PlayerCircle 
                key={`left-${index}`} 
                number={item} 
                bgColor={isGoalkeeper ? '#EF4444' : '#FFFFFF'} 
                borderColor={isGoalkeeper ? '#DC2626' : '#CBD5E1'}
                textColor={isGoalkeeper ? '#FFFFFF' : '#0F172A'}
              />
            );
          })}
        </View>

        {/* THE VERTICAL DIVIDER LINE */}
        <View  />

        {/* RIGHT PLAYERS COLUMN (Blue Team) */}
        <View >
          {rightPlayers.map((item, index) => {
            const isGoalkeeper = index === 0;
            return (
              <PlayerCircle 
                key={`right-${index}`} 
                number={item} 
                bgColor={isGoalkeeper ? '#EF4444' : '#1E40AF'} 
                borderColor={isGoalkeeper ? '#DC2626' : '#1E3A8A'}
                textColor={isGoalkeeper ? '#FFFFFF' : '#FFFFFF'} 
              />
            );
          })}
        </View>
      </View>

     
      <View >
        
        
        <TouchableOpacity activeOpacity={0.8} >
          <Text>Play</Text>
        </TouchableOpacity>

       
        <TouchableOpacity onPress={onViewLogSelect} activeOpacity={0.7} >
          <Text >View Log</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({

// mainContainer: {
//   flex: 1,
//   justifyContent: 'center',
//   alignItems: 'center',

//   backgroundColor: '#F8FAFC',

//   paddingHorizontal: 20,
//   paddingVertical: 10,

//   borderRightWidth: 1,
//   borderLeftWidth: 1,

//   borderColor: '#E2E8F0',

//   flexShrink: 1,
//   overflow: 'hidden',
// },

//   rosterRowSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',

//     flexShrink: 1,
//   },

//   leftRosterColumn: {
//     gap: 6,
//     paddingRight: 16,
//     alignItems: 'center',
//   },

// verticalCourtDivider: {
//   width: 2,
//   height: '88%',
//   backgroundColor: '#E2E8F0',
//   borderRadius: 1,
//   marginHorizontal: 4,
// },

//   rightRosterColumn: {
//     gap: 6,
//     paddingLeft: 16,
//     alignItems: 'center',
//   },

//   footerControlPanel: {
//     marginTop: 14,

//     gap: 12,

//     width: 160,

//     paddingBottom: 10,
//   },

//   playActionButton: {
//     height: 46,

//     borderRadius: 10,

//     justifyContent: 'center',
//     alignItems: 'center',

//     backgroundColor: '#10B981',

//     shadowColor: '#10B981',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 5,

//     elevation: 3,
//   },

//   playButtonText: {
//     fontSize: 20,
//     color: '#FFFFFF',
//     fontWeight: '700',
//     letterSpacing: -0.2,
//   },

//   viewLogButton: {
//     height: 44,

//     borderWidth: 1.5,
//     borderColor: '#CBD5E1',

//     borderRadius: 10,

//     justifyContent: 'center',
//     alignItems: 'center',

//     backgroundColor: '#FFFFFF',

//     shadowColor: '#0F172A',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,

//     elevation: 1,
//   },

//   viewLogButtonText: {
//     fontSize: 16,
//     color: '#334155',
//     fontWeight: '600',
//     letterSpacing: -0.1,
//   },

// });
