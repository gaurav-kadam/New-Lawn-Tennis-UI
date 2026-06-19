import React from 'react';

import {
    Image,
    Pressable,
    Text,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/theme/themeContext';

type Props = {
  label: string | number;
  active?: boolean;
  onPress?: () => void;
  icon?: any;
  image?: any;
};

export default function MatchChip({
  label,
  active = false,
  onPress,
  icon,
  image,
}: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {image && (
          <Image
            source={image}
            style={{
              width: 22,
              height: 22,
              resizeMode: 'contain',
            }}
          />
        )}

        {!image && icon && (
          <Ionicons
            name={icon}
            size={16}
            color={
              active
                ? theme.colors.surface
                : theme.colors.textPrimary
            }
          />
        )}

        <Text
          style={{
            color: active
              ? theme.colors.surface
              : theme.colors.textPrimary,
            fontWeight: '700',
            fontSize: theme.typography.sizes.small,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}