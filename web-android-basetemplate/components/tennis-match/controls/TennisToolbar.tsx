import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/themeContext';

type Props = {
  onAce?: () => void;
  onFault?: () => void;
  onWinner?: () => void;
  onError?: () => void;
  onDoubleFault?: () => void;
  onVolley?: () => void;
  onServe?: () => void;
  onUndo?: () => void;
  // onNextGame?: () => void;
  disabled?: boolean;
  undoDisabled?: boolean;
};

export default function TennisToolbar({
  onAce = () => {},
  onFault = () => {},
  onWinner = () => {},
  onError = () => {},
  onDoubleFault = () => {},
  onVolley = () => {},
  onServe = () => {},
  onUndo = () => {},
  // onNextGame = () => {},
  disabled = false,
  undoDisabled = false,
}: Props) {
  const theme = useTheme();
  const actions = [
    { label: 'Ace', onPress: onAce },
    { label: 'Fault', onPress: onFault },
    { label: 'Winner', onPress: onWinner },
    { label: 'Unforced Error', onPress: onError },
    { label: 'Double Fault', onPress: onDoubleFault },
    { label: 'Volley', onPress: onVolley },
    { label: 'Serve', onPress: onServe },
    { label: 'Undo', onPress: onUndo, disabled: undoDisabled, primary: true },
    // { label: 'Next Game', onPress: onNextGame },
  ];

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      {actions.map((action) => {
        const isDisabled = disabled || action.disabled;
        return (
          <Pressable
            key={action.label}
            onPress={action.onPress}
            disabled={isDisabled}
            style={[
              styles.button,
              {
                backgroundColor: action.primary ? theme.colors.primary : theme.colors.surface,
                borderColor: action.primary ? theme.colors.primary : theme.colors.border,
                opacity: isDisabled ? 0.45 : 1,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.buttonText,
                { color: action.primary ? theme.colors.textLight : theme.colors.textPrimary },
              ]}
            >
              {action.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  button: {
    flex: 1,
    height: 42,
    minWidth: 0,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
});
