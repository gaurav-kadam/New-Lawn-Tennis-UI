import React from 'react';
import { Modal, Text, View } from 'react-native';

import { TOTAL_SESSIONS } from '@/components/match/constants/matchConfig';
import Button from '@/components/ui/Button';
import { useTheme } from '@/theme/themeContext';

type Props = {
  visible: boolean;
  session: number;
  leaderText: string;
  onContinue: () => void;
};

export default function SessionEndModal({
  visible,
  session,
  leaderText,
  onContinue,
}: Props) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: `${theme.colors.textPrimary}73`,
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.lg,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: theme.spacing.xl * 14,
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.xl,
            borderRadius: theme.radius.lg,
            ...theme.shadow.medium,
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.sizes.h2,
              fontWeight: '800',
              color: theme.colors.textPrimary,
              textAlign: 'center',
            }}
          >
            Session {session} Ended
          </Text>

          <Text
            style={{
              marginTop: theme.spacing.md,
              fontSize: theme.typography.sizes.h3,
              color: theme.colors.textSecondary,
              textAlign: 'center',
            }}
          >
            {leaderText}
          </Text>

          <Button
            title={
              session < TOTAL_SESSIONS
                ? 'Start Next Session'
                : 'View Result'
            }
            variant="primary"
            style={{ marginTop: theme.spacing.lg }}
            onPress={onContinue}
          />
        </View>
      </View>
    </Modal>
  );
}