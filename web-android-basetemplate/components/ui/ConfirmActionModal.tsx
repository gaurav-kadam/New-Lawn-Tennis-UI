import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Text, View } from 'react-native';
import { useTheme } from '@/theme/themeContext';
import { tokens } from '@/theme/token';
import Button from '@/components/ui/Button';

export type ConfirmActionType = 'DELETE' | 'UPDATE' | 'CREATE';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  actionType?: ConfirmActionType;
};

const ACTION_CONFIG: Record<ConfirmActionType, { icon: any; iconBg: string; iconColor: string }> = {
  DELETE: {
    icon: 'trash-outline',
    iconBg: tokens.colors.actions.deleteBg,
    iconColor: tokens.colors.error,
  },
  UPDATE: {
    icon: 'pencil-outline',
    iconBg: 'rgba(99,102,241,0.10)',
    iconColor: tokens.colors.primary,
  },
  CREATE: {
    icon: 'add-circle-outline',
    iconBg: tokens.colors.actions.saveBg,
    iconColor: tokens.colors.success,
  },
};

export default function ConfirmActionModal({
  visible,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
  actionType = 'DELETE',
}: Props) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(0.88)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 120,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.88);
      opacity.setValue(0);
    }
  }, [visible]);

  const config = ACTION_CONFIG[actionType];
  const resolvedConfirmText = confirmText ?? (actionType === 'DELETE' ? 'Delete' : 'Confirm');
  const confirmVariant = actionType === 'DELETE' ? 'danger' : 'primary';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.45)',
        padding: tokens.spacing.lg,
      }}>
        <Animated.View style={{
          width: '100%',
          maxWidth: 380,
          backgroundColor: theme.colors.surface,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.xl,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: theme.colors.border,
          transform: [{ scale }],
          opacity,
          ...tokens.shadow.light,
        }}>
          {/* Icon */}
          <View style={{
            width: 68,
            height: 68,
            borderRadius: 34,
            backgroundColor: config.iconBg,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: tokens.spacing.md,
          }}>
            <Ionicons name={config.icon} size={34} color={config.iconColor} />
          </View>

          {/* Title */}
          <Text style={{
            fontSize: theme.typography.sizes.h3,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.fontFamily,
            marginBottom: tokens.spacing.xs,
            textAlign: 'center',
          }}>
            {title}
          </Text>

          {/* Message */}
          <Text style={{
            fontSize: theme.typography.sizes.body,
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.fontFamily,
            textAlign: 'center',
            marginBottom: tokens.spacing.xl,
            lineHeight: 22,
          }}>
            {message}
          </Text>

          {/* Buttons row */}
          <View style={{ flexDirection: 'row', gap: tokens.spacing.sm, width: '100%' }}>
            <Button
              title={cancelText}
              variant="outline"
              size="md"
              onPress={onCancel}
              disabled={loading}
              style={{ flex: 1 }}
            />
            <Button
              title={resolvedConfirmText}
              variant={confirmVariant}
              size="md"
              onPress={onConfirm}
              loading={loading}
              style={{ flex: 1 }}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
