  import React from 'react';
  import { Pressable, StyleSheet, Text, View } from 'react-native';
  import { useTheme } from '@/theme/themeContext';

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

        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.success, borderColor: theme.colors.success, opacity: disabled ? 0.45 : 1 }]}
          onPress={onPlayer1Point}
          disabled={disabled}
        >
          <Text style={styles.buttonKicker}>POINT TO</Text>
          <Text numberOfLines={1} style={styles.buttonText}>
            {player1Name.toUpperCase()}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, opacity: disabled ? 0.45 : 1 }]}
          onPress={onPlayer2Point}
          disabled={disabled}
        >
          <Text style={styles.buttonKicker}>POINT TO</Text>
          <Text numberOfLines={1} style={styles.buttonText}>
            {player2Name.toUpperCase()}
          </Text>
        </Pressable>

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
