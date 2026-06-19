
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

export default function HeaderBar() {
  const headerBg = '#11141A'; 
  const surfaceSystem = '#1E2530'; 
  const coreBoxBg = '#0F1319';
  
  const textPrimary = '#FFFFFF';
  const textSecondary = '#64748B'; 
  const borderSystem = '#E2E8F0';        
  const accentAlert = '#22C55E';          

  return (
    <View style={[styles.headerContainer, { backgroundColor: headerBg }]}>
      
      {/* LEFT SIDE: MENU ACTION */}
      <View style={styles.actionBlock}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: surfaceSystem, borderColor: borderSystem }]} 
          activeOpacity={0.7}
        >
          <Text style={[styles.menuIcon, { color: textPrimary }]}>≡</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.clubNameWrapper}>
        <Text style={[styles.clubNameText, { color: textPrimary }]} numberOfLines={2}>
          Serbia
        </Text>
      </View>

      <View style={styles.scoreboardContainer}>
        
        <View style={[styles.teamBlock, styles.teamRightAlign]}>
          <Text style={[styles.teamName, { color: '#E2E8F0' }]} numberOfLines={1}>SRB</Text>
          <View style={[styles.teamIndicator, { backgroundColor: '#f6f7f8' }]} />
        </View>

        <View style={[styles.scoreSystem, { backgroundColor: surfaceSystem, borderColor: borderSystem }]}>
         
          <View style={[styles.scoreBox, styles.scoreBoxLeft, { backgroundColor: coreBoxBg }]}>
            <Text style={[styles.scoreText, { color: textPrimary }]}>4</Text>
          </View>

          
          <View style={styles.timeBox}>
            <Text style={[styles.clockText, { color: accentAlert }]}>00:00</Text>
          </View>

        
          <View style={[styles.scoreBox, styles.scoreBoxRight, { backgroundColor: coreBoxBg }]}>
            <Text style={[styles.scoreText, { color: textPrimary }]}>5</Text>
          </View>
        </View>

        
        <View style={[styles.teamBlock, styles.teamLeftAlign]}>
          <View style={[styles.teamIndicator, { backgroundColor: '#0b259b' }]} />
          <Text style={[styles.teamName, { color: '#E2E8F0' }]} numberOfLines={1}>SWE</Text>
        </View>

      </View>

      
      <View style={styles.clubNameWrapper}>
        <Text style={[styles.clubNameText, { color: textPrimary }]} numberOfLines={2}>
          Swedan
        </Text>
      </View>

     
      <View style={styles.actionBlock}>
        <TouchableOpacity style={[styles.periodButton, { backgroundColor: accentAlert }]} activeOpacity={0.7}>
          <Text style={styles.periodText}>Q1</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  actionBlock: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  menuIcon: {
    fontSize: 26,
    fontWeight: 'bold',
    includeFontPadding: false,
  },
  clubNameWrapper: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  clubNameText: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  scoreboardContainer: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  teamBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamRightAlign: {
    justifyContent: 'flex-end',
  },
  teamLeftAlign: {
    justifyContent: 'flex-start',
  },
  teamName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  teamIndicator: {
    width: 10,
    height: 24,
    borderRadius: 3,
  },
  scoreSystem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 12,
    borderWidth: 1,
  },
  scoreBox: {
    width: 50,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  scoreBoxLeft: {
    borderRightWidth: 0,
  },
  scoreBoxRight: {
    borderLeftWidth: 0,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  timeBox: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockText: {
    fontSize: 26,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  periodButton: {
    width: 54,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
  },
});
