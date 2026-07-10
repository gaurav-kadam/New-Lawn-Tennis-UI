import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';


import { useTheme } from '@/theme/themeContext';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel?: string;
  tooltip?: string;
};

export default function HeaderIconButton({ icon, onPress, accessibilityLabel, tooltip }: Props) {
  const theme = useTheme();

  const button = (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={{
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons
        name={icon}
        size={theme.typography.sizes.small}
        color={theme.colors.primary}
      />
    </Pressable>
  );

  if (tooltip) {
    return <Tooltip label={tooltip}>{button}</Tooltip>;
  }

  return button;
}
