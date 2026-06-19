import React from 'react';
import { Text, TouchableOpacity, View, Pressable, Modal } from 'react-native';
import { useTheme } from '../../theme/themeContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayName: string;
  displayEmail: string;
  displayRole: string;
}

export default function ProfileModal({
  isOpen,
  onClose,
  displayName,
  displayEmail,
  displayRole,
}: ProfileModalProps) {
  const theme = useTheme();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: theme.layout.flexFull,
          backgroundColor: theme.colors.overlay,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            width: '90%',
            maxWidth: theme.layout.logModal.containerMaxWidth * 0.43, // Scales nicely below 400px
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: theme.layout.popupCard.borderWidth,
            borderColor: theme.colors.border,
            padding: theme.spacing.lg,
            ...theme.shadow.medium,
          }}
          onPress={(e) => e.stopPropagation()} // Prevent closing when tapping inside card
        >
          {/* Modal Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: theme.layout.dividerHeight,
              borderBottomColor: theme.colors.border,
              paddingBottom: theme.spacing.sm + 6,
              marginBottom: theme.spacing.lg,
            }}
          >
            <Text
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.sizes.h3,
                fontWeight: theme.typography.weights.bold as any,
                color: theme.colors.textPrimary,
              }}
            >
              Account Information
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                style={{
                  fontSize: theme.typography.sizes.h2,
                  color: theme.colors.textSecondary,
                  fontWeight: theme.typography.weights.regular as any,
                }}
              >
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {/* Profile Content List */}
          <View style={{ gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
            <View>
              <Text
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.cooldownTimer,
                  fontWeight: theme.typography.weights.bold as any,
                  color: theme.colors.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Full Name
              </Text>
              <Text
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.playerNumber,
                  fontWeight: theme.typography.weights.medium as any,
                  color: theme.colors.textPrimary,
                  marginTop: theme.spacing.xs,
                  textTransform: 'capitalize',
                }}
              >
                {displayName}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.cooldownTimer,
                  fontWeight: theme.typography.weights.bold as any,
                  color: theme.colors.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Email Address
              </Text>
              <Text
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.small,
                  fontWeight: theme.typography.weights.regular as any,
                  color: theme.colors.textPrimary,
                  marginTop: theme.spacing.xs,
                }}
              >
                {displayEmail}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.cooldownTimer,
                  fontWeight: theme.typography.weights.bold as any,
                  color: theme.colors.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Role
              </Text>
              <Text
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.small,
                  fontWeight: theme.typography.weights.medium as any,
                  color: theme.colors.primary,
                  marginTop: theme.spacing.xs,
                }}
              >
                {displayRole}
              </Text>
            </View>
          </View>

          {/* Close Button Action */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: theme.colors.primary,
              paddingVertical: theme.spacing.sm + 4,
              borderRadius: theme.radius.md,
              alignItems: 'center',
              justifyContent: 'center',
              height: theme.layout.popupCard.confirmButtonHeight,
            }}
          >
            <Text
              style={{
                fontFamily: theme.typography.fontFamily,
                color: theme.colors.textLight,
                fontSize: theme.typography.sizes.small,
                fontWeight: theme.typography.weights.medium as any,
              }}
            >
              Close Details
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}