import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { MatchAgeCategory } from '@/components/match/constants/matchConfig';
import { useTheme } from '@/theme/themeContext';

type Props = {
  value: MatchAgeCategory;
  onChange: (value: MatchAgeCategory) => void;
};

export default function MatchFormatSelector({
  value,
  onChange,
}: Props) {
  const theme = useTheme();

  const Option = ({
    label,
    option,
  }: {
    label: string;
    option: MatchAgeCategory;
  }) => {
    const active = value === option;

    return (
      <Pressable
        onPress={() => onChange(option)}
        style={{
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          borderRadius: theme.radius.md,
          backgroundColor: active
            ? theme.colors.primary
            : theme.colors.surface,
          borderWidth: 1,
          borderColor: active
            ? theme.colors.primary
            : theme.colors.border,
        }}
      >
        <Text
          style={{
            color: active
              ? theme.colors.surface
              : theme.colors.textPrimary,
            fontSize: theme.typography.sizes.small,
            fontWeight: '700',
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: theme.spacing.sm,
        alignItems: 'center',
      }}
    >
      <Option label="U17" option="UNDER_17" />
      <Option label="Open" option="OPEN" />
    </View>
  );
}