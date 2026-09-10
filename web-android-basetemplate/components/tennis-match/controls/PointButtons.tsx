  import React from 'react';
  import { StyleSheet, type TextStyle, View } from 'react-native';
  import { Text, TouchableRipple } from 'react-native-paper';
  import { useTheme } from '@/theme/themeContext';

  // Preserve the original RN font metrics rather than Paper typography defaults.
  const nativeTextDefaults: TextStyle = {
    fontFamily: undefined,
    fontWeight: undefined,
    lineHeight: undefined,
    letterSpacing: undefined,
    textAlign: undefined,
    writingDirection: undefined,
  };

  type Props = {
    player1Name: string;
    player2Name: string;

    onPlayer1Point?: () => void;
    onPlayer2Point?: () => void;

    disabled?: boolean;
  };

  export default function PointButtons({
    player1Name,
    player2Name,
    onPlayer1Point,
    onPlayer2Point,
    disabled = false,
  }: Props) {
    const theme = useTheme();

    return (
      <View style={styles.container}>

        <TouchableRipple
          style={[styles.button, { backgroundColor: theme.colors.success, borderColor: theme.colors.success, opacity: disabled ? 0.45 : 1 }]}
          onPress={onPlayer1Point}
          disabled={disabled}
          rippleColor="transparent"
          underlayColor="transparent"
        >
          <>
            <Text style={[nativeTextDefaults, styles.buttonKicker]}>POINT TO</Text>
            <Text numberOfLines={1} style={[nativeTextDefaults, styles.buttonText]}>
              {player1Name.toUpperCase()}
            </Text>
          </>
        </TouchableRipple>

        <TouchableRipple
          style={[styles.button, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, opacity: disabled ? 0.45 : 1 }]}
          onPress={onPlayer2Point}
          disabled={disabled}
          rippleColor="transparent"
          underlayColor="transparent"
        >
          <>
            <Text style={[nativeTextDefaults, styles.buttonKicker]}>POINT TO</Text>
            <Text numberOfLines={1} style={[nativeTextDefaults, styles.buttonText]}>
              {player2Name.toUpperCase()}
            </Text>
          </>
        </TouchableRipple>

      </View>
    );
  }

  const styles = StyleSheet.create({

    container: {
      flexDirection: 'row',
      gap: 10,
    },

    button: {
      flex: 1,
      height: 72,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    buttonKicker: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
      opacity: 0.9,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '900',
      marginTop: 3,
    },

  });
