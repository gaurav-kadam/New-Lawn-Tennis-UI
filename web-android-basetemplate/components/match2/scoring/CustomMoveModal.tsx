import React from 'react';
import { Modal, Text, TextInput, View } from 'react-native';

import Button from '@/components/ui/Button';
import { useTheme } from '@/theme/themeContext';

type Props = {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onAdd: () => void;
};

export default function CustomMoveModal({
  visible,
  value,
  onChangeText,
  onClose,
  onAdd,
}: Props) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: `${theme.colors.textPrimary}73`,
        }}
      >
        <View
          style={{
            width: 420,
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.lg,
            borderRadius: theme.radius.lg,
            ...theme.shadow.medium,
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.h2,
              fontWeight: '800',
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.md,
            }}
          >
            Add Custom Move
          </Text>

          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Enter move name"
            placeholderTextColor={
              theme.colors.textSecondary
            }
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
              color: theme.colors.textPrimary,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              gap: theme.spacing.sm,
              marginTop: theme.spacing.md,
            }}
          >
            <Button
              title="Cancel"
              variant="outline"
              onPress={onClose}
              style={{ flex: 1 }}
            />

            <Button
              title="Add Move"
              variant="primary"
              onPress={onAdd}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}