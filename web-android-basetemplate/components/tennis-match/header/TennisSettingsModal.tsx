import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/theme/themeContext';

type SettingsAction = 'RESTART' | 'RESET' | null;

type Props = {
  visible: boolean;
  isFullscreen: boolean;
  onClose: () => void;
  onRestart: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
};

export default function TennisSettingsModal({
  visible,
  isFullscreen,
  onClose,
  onRestart,
  onReset,
  onToggleFullscreen,
}: Props) {
  const theme = useTheme();

  const [confirmAction, setConfirmAction] =
    useState<SettingsAction>(null);

  const closeModal = () => {
    setConfirmAction(null);
    onClose();
  };

  const handleConfirm = () => {
    if (confirmAction === 'RESTART') {
      onRestart();
    } else if (confirmAction === 'RESET') {
      onReset();
    }

    setConfirmAction(null);
  };

  const confirmationTitle =
    confirmAction === 'RESTART'
      ? 'Restart Match?'
      : 'Reset Match?';

  const confirmationMessage =
    confirmAction === 'RESTART'
      ? 'This will clear the current score, games, sets, events and match timer. The same players, court and match format will be kept.'
      : 'This will clear the current match session and return you to the Matches screen. This action cannot be undone.';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeModal}
        />

        <View
          style={[
            styles.panel,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {confirmAction ? (
            <>
              <View style={styles.confirmHeader}>
                <View
                  style={[
                    styles.warningIcon,
                    {
                      backgroundColor:
                        confirmAction === 'RESET'
                          ? `${theme.colors.error}18`
                          : `${theme.colors.primary}18`,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      confirmAction === 'RESET'
                        ? 'warning-outline'
                        : 'refresh-outline'
                    }
                    size={24}
                    color={
                      confirmAction === 'RESET'
                        ? theme.colors.error
                        : theme.colors.primary
                    }
                  />
                </View>

                <View style={styles.confirmTitleWrap}>
                  <Text
                    style={[
                      styles.title,
                      {
                        color:
                          theme.colors.textPrimary,
                      },
                    ]}
                  >
                    {confirmationTitle}
                  </Text>

                  <Text
                    style={[
                      styles.confirmMessage,
                      {
                        color:
                          theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {confirmationMessage}
                  </Text>
                </View>
              </View>

              <View style={styles.confirmActions}>
                <Pressable
                  onPress={() =>
                    setConfirmAction(null)
                  }
                  style={[
                    styles.confirmButton,
                    styles.cancelButton,
                    {
                      borderColor:
                        theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.confirmButtonText,
                      {
                        color:
                          theme.colors.textPrimary,
                      },
                    ]}
                  >
                    CANCEL
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleConfirm}
                  style={[
                    styles.confirmButton,
                    {
                      backgroundColor:
                        confirmAction === 'RESET'
                          ? theme.colors.error
                          : theme.colors.primary,

                      borderColor:
                        confirmAction === 'RESET'
                          ? theme.colors.error
                          : theme.colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.confirmButtonText,
                      {
                        color:
                          theme.colors.textLight,
                      },
                    ]}
                  >
                    {confirmAction}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              {/* HEADER */}

              <View style={styles.header}>
                <View>
                  <Text
                    style={[
                      styles.title,
                      {
                        color:
                          theme.colors.textPrimary,
                      },
                    ]}
                  >
                    SETTINGS
                  </Text>

                  <Text
                    style={[
                      styles.subtitle,
                      {
                        color:
                          theme.colors.textSecondary,
                      },
                    ]}
                  >
                    Match controls
                  </Text>
                </View>

                <Pressable
                  onPress={closeModal}
                  style={[
                    styles.closeButton,
                    {
                      borderColor:
                        theme.colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="close"
                    size={18}
                    color={
                      theme.colors.textPrimary
                    }
                  />
                </Pressable>
              </View>

              {/* MATCH */}

              <View
                style={[
                  styles.section,
                  {
                    borderTopColor:
                      theme.colors.border,
                  },
                ]}
              >
                <Text style={styles.sectionTitle}>
                  MATCH
                </Text>

                <SettingsRow
                  icon="refresh-outline"
                  title="Restart Match"
                  description="Start this match again from 0–0"
                  iconColor={
                    theme.colors.primary
                  }
                  textColor={
                    theme.colors.textPrimary
                  }
                  secondaryColor={
                    theme.colors.textSecondary
                  }
                  borderColor={
                    theme.colors.border
                  }
                  onPress={() =>
                    setConfirmAction(
                      'RESTART'
                    )
                  }
                />

                <SettingsRow
                  icon="warning-outline"
                  title="Reset Match"
                  description="Clear this session and return to Matches"
                  iconColor={
                    theme.colors.error
                  }
                  textColor={
                    theme.colors.textPrimary
                  }
                  secondaryColor={
                    theme.colors.textSecondary
                  }
                  borderColor={
                    theme.colors.border
                  }
                  onPress={() =>
                    setConfirmAction(
                      'RESET'
                    )
                  }
                />
              </View>

              {/* DISPLAY */}

              {Platform.OS === 'web' && (
                <View
                  style={[
                    styles.section,
                    {
                      borderTopColor:
                        theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={styles.sectionTitle}
                  >
                    DISPLAY
                  </Text>

                  <SettingsRow
                    icon={
                      isFullscreen
                        ? 'contract-outline'
                        : 'expand-outline'
                    }
                    title={
                      isFullscreen
                        ? 'Exit Full Screen'
                        : 'Full Screen'
                    }
                    description={
                      isFullscreen
                        ? 'Leave browser fullscreen mode'
                        : 'Use the complete screen for scoring'
                    }
                    iconColor={
                      theme.colors.primary
                    }
                    textColor={
                      theme.colors.textPrimary
                    }
                    secondaryColor={
                      theme.colors.textSecondary
                    }
                    borderColor={
                      theme.colors.border
                    }
                    onPress={
                      onToggleFullscreen
                    }
                  />
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

type SettingsRowProps = {
  icon: React.ComponentProps<
    typeof Ionicons
  >['name'];

  title: string;
  description: string;

  iconColor: string;
  textColor: string;
  secondaryColor: string;
  borderColor: string;

  onPress: () => void;
};

function SettingsRow({
  icon,
  title,
  description,
  iconColor,
  textColor,
  secondaryColor,
  borderColor,
  onPress,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          borderBottomColor:
            borderColor,
          opacity: pressed ? 0.72 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.rowIcon,
          {
            backgroundColor:
              `${iconColor}18`,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={iconColor}
        />
      </View>

      <View style={styles.rowContent}>
        <Text
          style={[
            styles.rowTitle,
            {
              color: textColor,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.rowDescription,
            {
              color: secondaryColor,
            },
          ]}
        >
          {description}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={16}
        color={secondaryColor}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor:
      'rgba(2, 6, 23, 0.42)',

    alignItems: 'flex-end',
    justifyContent: 'flex-start',

    paddingTop: 76,
    paddingRight: 18,
  },

  panel: {
    width: '90%',
    maxWidth: 360,

    borderWidth: 1,
    borderRadius: 12,

    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 12,
  },

  header: {
    minHeight: 70,

    paddingHorizontal: 18,
    paddingVertical: 12,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },

  closeButton: {
    width: 32,
    height: 32,

    borderRadius: 8,
    borderWidth: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },

  section: {
    borderTopWidth: 1,

    paddingHorizontal: 18,
    paddingTop: 14,
  },

  sectionTitle: {
    color: '#64748B',

    fontSize: 10,
    fontWeight: '900',

    letterSpacing: 0.8,

    marginBottom: 2,
  },

  row: {
    minHeight: 68,

    flexDirection: 'row',
    alignItems: 'center',

    borderBottomWidth: 1,

    gap: 10,
  },

  rowIcon: {
    width: 34,
    height: 34,

    borderRadius: 9,

    alignItems: 'center',
    justifyContent: 'center',
  },

  rowContent: {
    flex: 1,
    minWidth: 0,
  },

  rowTitle: {
    fontSize: 13,
    fontWeight: '800',
  },

  rowDescription: {
    fontSize: 10,
    fontWeight: '600',

    marginTop: 3,
  },

  confirmHeader: {
    padding: 20,

    flexDirection: 'row',

    gap: 12,
  },

  warningIcon: {
    width: 44,
    height: 44,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmTitleWrap: {
    flex: 1,
  },

  confirmMessage: {
    fontSize: 11,
    lineHeight: 17,

    fontWeight: '600',

    marginTop: 5,
  },

  confirmActions: {
    padding: 18,
    paddingTop: 0,

    flexDirection: 'row',

    gap: 10,
  },

  confirmButton: {
    flex: 1,

    minHeight: 40,

    borderRadius: 8,
    borderWidth: 1,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 12,
  },

  cancelButton: {
    backgroundColor: 'transparent',
  },

  confirmButtonText: {
    fontSize: 11,
    fontWeight: '900',
  },
});