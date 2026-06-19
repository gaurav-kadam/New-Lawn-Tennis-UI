import React from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../../../theme/themeContext';

import MatchPlayerCircle from './MatchPlayerCircle';

import MatchActionButton from '../controls/MatchActionButton';
import Button from '@/components/ui/Button';

interface Props {
  onViewLogPress: () => void;
}

export default function MatchPlayerColumn({
  onViewLogPress,
}: Props) {

  const theme = useTheme();


  const leftPlayers = [1, 4, 5, 7, 8, 10, 11];

  const rightPlayers = [1, 3, 6, 9, 12, 14, 15];

return (
 <View
  style={{
    flex: 1,
    backgroundColor: theme.colors.background,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.border,
  }}
>

  {/* ================= TOP 80% PLAYERS ================= */}
  <View
    style={{
      flex: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    }}
  >

    {/* LEFT PLAYERS */}
    <View
        style={{
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
    >
      {leftPlayers.map((player, index) => (
        <MatchPlayerCircle
          key={`left-${player}`}
          number={player}
          goalkeeper={index === 0}
          team="left"
        />
      ))}
    </View>

    {/* CENTER DIVIDER */}
    <View
      style={{
        width: 2,
        alignSelf: 'stretch',
        backgroundColor: theme.colors.border,
        borderRadius: 999,
      }}
    />

    {/* RIGHT PLAYERS */}
    <View
      style={{
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
    >
      {rightPlayers.map((player, index) => (
        <MatchPlayerCircle
          key={`right-${player}`}
          number={player}
          goalkeeper={index === 0}
          team="right"
        />
      ))}
    </View>

  </View>

  {/* ================= BOTTOM 20% ACTIONS ================= */}
  <View
    style={{
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.md,
    }}
  >

    <Button
      title="View Log"
      icon="document-text-outline"
      size="sm"
      style={{ width: '80%' }}
    />

    <Button
      title="Play"
      icon="play"
      size="sm"
      style={{ width: '80%' }}
    />

  </View>

</View>
);
}

