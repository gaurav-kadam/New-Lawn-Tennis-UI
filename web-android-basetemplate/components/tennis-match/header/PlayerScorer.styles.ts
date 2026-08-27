 import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/themeContext';

 export const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    gap: 10,
  },
  playerPanel: {
    width: '22%',
    minWidth: 190,
    justifyContent: 'center',
    gap: 8,
  },
  playerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  scorePanel: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 0,
  },
  matchStrip: {
    minHeight: 28,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 12,
  },
  matchStripText: {
    fontSize: 14,
    fontWeight: '800',
  },
  matchStripDot: {
    fontSize: 14,
    fontWeight: '800',
  },
  scoreHeaderRow: {
    flexDirection: 'row',
    minHeight: 24,
    alignItems: 'center',
  },
  columnLabel: {
    flex: 1,
    minWidth: 42,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 38,
    borderTopWidth: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  playerTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  serverDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  playerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  playerMeta: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
  scoreCell: {
    flex: 1,
    minWidth: 42,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
  },
  pointCell: {
    flex: 1,
    minWidth: 42,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '900',
  }
});