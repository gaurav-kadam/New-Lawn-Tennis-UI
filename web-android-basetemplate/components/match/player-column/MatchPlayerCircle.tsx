import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../../../theme/themeContext';

interface Props {
  number: number;

  selected?: boolean;

  goalkeeper?: boolean;

  team?: 'left' | 'right';
}

export default function MatchPlayerCircle({
  number,
  selected = false,
  goalkeeper = false,
  team = 'left',
}: Props) {

  const theme = useTheme();


  const getBackgroundColor = () => {

    if (goalkeeper) {
      return theme.colors.error;
    }

    if (team === 'right') {
      return theme.colors.primary;
    }

    return theme.colors.surface;
  };

  const getBorderColor = () => {

    if (selected) {
      return theme.colors.primary;
    }

    if (goalkeeper) {
      return theme.colors.error;
    }

    return theme.colors.border;
  };

  const getTextColor = () => {

    if (
      goalkeeper ||
      team === 'right'
    ) {
      return '#FFFFFF';
    }

    return theme.colors.textPrimary;
  };

  return (
    <View
      style={[
       {
         width: 54,
      height: 54,

      borderRadius: 999,

      justifyContent: 'center',
      alignItems: 'center',

      borderWidth: 2,
       },
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
      ]}
    >
      <Text
        style={[
        

          {
            color: getTextColor(),
          },
        ]}
      >
        {number}
      </Text>
    </View>
  );
}

