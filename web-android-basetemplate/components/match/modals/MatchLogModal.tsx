import React from 'react';

import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../../../theme/themeContext';

import MatchActionButton from '../controls/MatchActionButton';

interface Props {
  visible: boolean;

  onClose: () => void;
}

export default function MatchLogModal({
  visible,
  onClose,
}: Props) {

  const theme = useTheme();

  const styles = createStyles(theme);

  const logs = [
    '12:22 - Goal scored by Team A',
    '15:40 - Yellow card issued',
    '18:05 - Penalty missed',
    '24:12 - Goalkeeper save',
    '31:44 - Timeout requested',
    '38:19 - Goal scored by Team B',
  ];

  return (

    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >

      {/* OVERLAY */}

      <View style={styles.overlay}>

        {/* MODAL */}

        <View style={styles.modal}>

          {/* HEADER */}

          <View style={styles.header}>

            <Text style={styles.title}>
              Match Activity Log
            </Text>

          </View>

          {/* CONTENT */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.logContainer
            }
          >

            {logs.map((item, index) => (

              <View
                key={index}
                style={styles.logItem}
              >
                <Text style={styles.logText}>
                  {item}
                </Text>
              </View>

            ))}

          </ScrollView>

          {/* FOOTER */}

          <View style={styles.footer}>

            <MatchActionButton
              title="Close"
              variant="danger"
              onPress={onClose}
            />

          </View>

        </View>

      </View>

    </Modal>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({

    overlay: {
      flex: 1,

      justifyContent: 'center',
      alignItems: 'center',

      backgroundColor: 'rgba(0,0,0,0.45)',

      padding: theme.spacing.lg,
    },

    modal: {
      width: '100%',
      maxWidth: 600,

      maxHeight: '80%',

      borderRadius: theme.borderRadius.lg,

      backgroundColor: theme.colors.surface,

      overflow: 'hidden',
    },

    header: {
      padding: theme.spacing.lg,

      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },

    title: {
      fontSize: 20,
      fontWeight: '700',

      color: theme.colors.textPrimary,
    },

    logContainer: {
      padding: theme.spacing.lg,

      gap: theme.spacing.sm,
    },

    logItem: {
      padding: theme.spacing.md,

      borderRadius: theme.borderRadius.md,

      backgroundColor: theme.colors.background,

      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    logText: {
      fontSize: 14,
      lineHeight: 22,

      color: theme.colors.textPrimary,
    },

    footer: {
      padding: theme.spacing.lg,

      borderTopWidth: 1,
      borderColor: theme.colors.border,
    },

  });