import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useTheme } from '../../theme/themeContext';

export default function Card({
  children,
  variant = 'elevated', // elevated | outlined
  onPress,
}: any) {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  const isWeb = Platform.OS === 'web';

  const variants: any = {
    elevated: {
      backgroundColor: theme.colors.surface,
      borderWidth: 0,
    },
    outlined: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  };

  const v = variants[variant];

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => isWeb && setHovered(true)}
      onHoverOut={() => isWeb && setHovered(false)}
      style={({ pressed }) => ({
        backgroundColor: v.backgroundColor,
        borderWidth: v.borderWidth || 0,
        borderColor: v.borderColor,
        padding: theme.spacing.md,
        borderRadius: theme.radius.lg,
        
        // Shadow (mobile)
        elevation: variant === 'elevated' ? (hovered ? 6 : 3) : 0,

        // Shadow (iOS)
        shadowColor: '#000',
        shadowOpacity: variant === 'elevated' ? 0.1 : 0,
        shadowRadius: hovered ? 10 : 5,
        shadowOffset: { width: 0, height: hovered ? 6 : 3 },

        // Web hover + press effect
        transform: [
          { scale: pressed ? 0.98 : hovered ? 1.01 : 1 },
        ],

        transitionDuration: '150ms', // web smoothness
      })}
    >
      <View>{children}</View>
    </Pressable>
  );
}