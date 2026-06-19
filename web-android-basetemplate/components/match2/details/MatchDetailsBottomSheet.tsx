import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme/themeContext';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function MatchDetailsBottomSheet({
  visible,
  title,
  onClose,
  children,
}: Props) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: `${theme.colors.textPrimary}88`,
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.lg,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: theme.spacing.xl * 20,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.lg,
            ...theme.shadow.medium,
          }}
        >
          <View
            style={{
              width: theme.spacing.xl * 2,
              height: theme.spacing.xs,
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.border,
              alignSelf: 'center',
              marginBottom: theme.spacing.lg,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: theme.spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.sizes.h2,
                fontWeight: '900',
                color: theme.colors.textPrimary,
              }}
            >
              {title}
            </Text>

            <Pressable onPress={onClose}>
              <Text
                style={{
                  fontSize: theme.typography.sizes.h1,
                  color: theme.colors.textPrimary,
                }}
              >
                ×
              </Text>
            </Pressable>
          </View>

          {children}
        </View>
      </View>
    </Modal>
  );
}