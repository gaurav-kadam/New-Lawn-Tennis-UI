import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../../../theme/themeContext';

import MatchActionButton from '../controls/MatchActionButton';

interface Props {
  title: string;

  side?: 'left' | 'right';

  onClose: () => void;
}

export default function MatchOverlayMenu({
  title,
  side = 'left',
  onClose,
}: Props) {

  const theme = useTheme();

  const styles = createStyles(theme);

  const actions = [
    'Successful',
    'Failed',
    'Blocked',
    'Saved',
  ];

  return (

    <View
      style={[
        styles.container,

        side === 'left'
          ? styles.leftPosition
          : styles.rightPosition,
      ]}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>
          {title}
        </Text>

      </View>

      {/* ACTION LIST */}

      <View style={styles.actionList}>

        {actions.map((item) => (

          <MatchActionButton
            key={item}
            title={item}
            fullWidth
          />

        ))}

      </View>

      {/* FOOTER */}

      <MatchActionButton
        title="Close"
        variant="danger"
        onPress={onClose}
      />

    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({

    container: {
      position: 'absolute',

      top: '50%',

      transform: [
        {
          translateY: -120,
        },
      ],

      width: 220,

      padding: theme.spacing.md,

      borderRadius: theme.borderRadius.lg,

      backgroundColor: theme.colors.surface,

      borderWidth: 1,
      borderColor: theme.colors.border,

      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 10,

      elevation: 6,

      zIndex: 9999,
    },

    leftPosition: {
      left: theme.spacing.lg,
    },

    rightPosition: {
      right: theme.spacing.lg,
    },

    header: {
      marginBottom: theme.spacing.md,
    },

    title: {
      fontSize: 16,
      fontWeight: '700',

      color: theme.colors.textPrimary,
    },

    actionList: {
      gap: theme.spacing.sm,

      marginBottom: theme.spacing.md,
    },

  });