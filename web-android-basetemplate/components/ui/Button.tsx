// import { Ionicons } from '@expo/vector-icons';
// import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
// import { useTheme } from '../../theme/themeContext';

// export default function Button({
//   title,
//   onPress,
//   variant = 'primary',
//   size = 'md',
//   disabled = false,
//   loading = false,
//   icon, // 👈 NEW
//   iconPosition = 'left', // 👈 NEW (left/right)
// }: any) {
//   const theme = useTheme();

//   const variants: any = {
//     primary: {
//       backgroundColor: theme.colors.primary,
//       color: '#fff',
//       borderColor: theme.colors.primary,
//     },
//     outline: {
//       backgroundColor: 'transparent',
//       color: theme.colors.primary,
//       borderColor: theme.colors.primary,
//     },
//     ghost: {
//       backgroundColor: 'transparent',
//       color: theme.colors.textPrimary,
//       borderColor: 'transparent',
//     },
//     danger: {
//       backgroundColor: theme.colors.error,
//       color: '#fff',
//       borderColor: theme.colors.error,
//     },
//   };

//   const sizes: any = {
//     sm: {
//       padding: theme.spacing.sm,
//       fontSize: theme.typography.small,
//       iconSize: 16,
//     },
//     md: {
//       padding: theme.spacing.md,
//       fontSize: theme.typography.body,
//       iconSize: 18,
//     },
//     lg: {
//       padding: theme.spacing.lg,
//       fontSize: theme.typography.h3,
//       iconSize: 22,
//     },
//   };

//   const v = variants[variant];
//   const s = sizes[size];

//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       disabled={disabled || loading}
//       style={{
//         backgroundColor: v.backgroundColor,
//         borderWidth: 1,
//         borderColor: v.borderColor,
//         padding: s.padding,
//         borderRadius: theme.radius.md,
//         alignItems: 'center',
//         justifyContent: 'center',
//         opacity: disabled ? 0.5 : 1,
//       }}
//     >
//       {loading ? (
//         <ActivityIndicator color={v.color} />
//       ) : (
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          
//           {icon && iconPosition === 'left' && (
//             <Ionicons name={icon} size={s.iconSize} color={v.color} />
//           )}

//           <Text
//             style={{
//               color: v.color,
//               fontSize: s.fontSize,
//               fontFamily: theme.typography.fontFamily,
//             }}
//           >
//             {title}
//           </Text>

//           {icon && iconPosition === 'right' && (
//             <Ionicons name={icon} size={s.iconSize} color={v.color} />
//           )}

//         </View>
//       )}
//     </TouchableOpacity>
//   );
// }

import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '../../theme/themeContext';

export default function Button({
  title,
  onPress,

  variant = 'primary',
  size = 'md',

  disabled = false,
  loading = false,

  icon,
  iconPosition = 'left',

  // ================= CUSTOM COLORS =================
  backgroundColor,
  textColor,
  borderColor,

  style,
}: any) {

  const theme = useTheme();

  const variants: any = {

    primary: {
      backgroundColor: theme.colors.primary,
      color: '#FFFFFF',
      borderColor: theme.colors.primary,
    },

    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      borderColor: theme.colors.primary,
    },

    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.textPrimary,
      borderColor: 'transparent',
    },

    danger: {
      backgroundColor: theme.colors.error,
      color: '#FFFFFF',
      borderColor: theme.colors.error,
    },
  };

  const sizes: any = {

    sm: {
      paddingVertical: 8,
      paddingHorizontal: 12,

      fontSize: theme.typography.small,
      iconSize: 16,
    },

    md: {
      paddingVertical: 12,
      paddingHorizontal: 18,

      fontSize: theme.typography.body,
      iconSize: 18,
    },

    lg: {
      paddingVertical: 16,
      paddingHorizontal: 22,

      fontSize: theme.typography.h3,
      iconSize: 22,
    },
  };

  const v = variants[variant];
  const s = sizes[size];

  // ================= FINAL COLORS =================

  const finalBackgroundColor =
    backgroundColor || v.backgroundColor;

  const finalTextColor =
    textColor || v.color;

  const finalBorderColor =
    borderColor || v.borderColor;

  return (

    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[

        {
          backgroundColor: finalBackgroundColor,

          borderWidth: 1,
          borderColor: finalBorderColor,

          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,

          borderRadius: theme.radius.md,

          alignItems: 'center',
          justifyContent: 'center',

          opacity: disabled ? 0.5 : 1,
        },

        style,
      ]}
    >

      {loading ? (

        <ActivityIndicator color={finalTextColor} />

      ) : (

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >

          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={s.iconSize}
              color={finalTextColor}
            />
          )}

          <Text
            style={{
              color: finalTextColor,
              fontSize: s.fontSize,
              fontFamily: theme.typography.fontFamily,
              fontWeight: '600',
            }}
          >
            {title}
          </Text>

          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={s.iconSize}
              color={finalTextColor}
            />
          )}

        </View>
      )}

    </TouchableOpacity>
  );
}