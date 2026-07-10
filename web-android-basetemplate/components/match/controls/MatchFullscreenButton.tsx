import React from 'react';

import {
  TouchableOpacity,

  StyleSheet,

} from 'react-native';



import { Ionicons } from '@expo/vector-icons';



import { useTheme } from '../../../theme/themeContext';



interface Props {

  isFullscreen: boolean;

  onPress: () => void;

}



export default function MatchFullscreenButton({

  isFullscreen,

  onPress,

}: Props) {



  const theme = useTheme();



  const styles = createStyles(theme);



  return (

    <TouchableOpacity

      activeOpacity={0.8}

      onPress={onPress}

      style={styles.button}

    >

      <Ionicons

        name={

          isFullscreen

            ? 'contract-outline'

            : 'expand-outline'

        }

        size={20}

        color={theme.colors.textPrimary}

      />

    </TouchableOpacity>

  );

}



const createStyles = (theme: any) =>

  StyleSheet.create({



    button: {

      position: 'absolute',



      top: theme.spacing.md,

      right: theme.spacing.md,



      zIndex: 999999,



      width: 42,

      height: 42,



      borderRadius: theme.borderRadius.md,



      justifyContent: 'center',

      alignItems: 'center',



      backgroundColor: theme.colors.surface,



      borderWidth: 1,

      borderColor: theme.colors.border,



      shadowColor: '#000',

      shadowOpacity: 0.1,

      shadowRadius: 8,



      elevation: 4,

    },



  });