import React from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/themeContext';

interface Props {
  title: string;

  onPress?: () => void;

  icon?: any;

  active?: boolean;

  variant?: 'primary' | 'secondary' | 'danger';

  fullWidth?: boolean;

  style?: ViewStyle;
}

export default function MatchActionButton({
  title,
  onPress,
  icon,
  active = false,
  variant = 'secondary',
  fullWidth = true,
  style,
}: Props) {

  const theme = useTheme();

  const styles = createStyles(theme);

  const getBackgroundColor = () => {

    if (active) {
      return theme.colors.primary;
    }

    switch (variant) {

      case 'primary':
        return theme.colors.primary;

      case 'danger':
        return theme.colors.error;

      default:
        return theme.colors.surface;
    }
  };

  const getTextColor = () => {

    if (
      active ||
      variant === 'primary' ||
      variant === 'danger'
    ) {
      return '#FFFFFF';
    }

    return theme.colors.textPrimary;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.button,

        {
          backgroundColor: getBackgroundColor(),
          width: fullWidth ? '100%' : undefined,
        },

        style,
      ]}
    >

      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color={getTextColor()}
          style={styles.icon}
        />
      )}

      <Text
        style={[
          styles.title,

          {
            color: getTextColor(),
          },
        ]}
      >
        {title}
      </Text>

    </TouchableOpacity>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({

    button: {
      height: 48,

      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: theme.borderRadius.md,

      borderWidth: 1,
      borderColor: theme.colors.border,

      paddingHorizontal: theme.spacing.md,

      gap: theme.spacing.sm,
    },

    icon: {
      marginRight: 2,
    },

    title: {
      fontSize: 15,
      fontWeight: '600',
    },

  });