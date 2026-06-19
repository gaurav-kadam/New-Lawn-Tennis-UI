import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../theme/themeContext';

export default function Checkbox({
  label,
  value,
  onChange,
}: any) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: theme.spacing.md,
      }}
    >
      <View
        style={{
          width: 18,
          height: 18,
          borderWidth: 2,
          borderColor: theme.colors.border,
          backgroundColor: value ? theme.colors.primary : 'transparent',
        }}
      />

      <Text style={{ color: theme.colors.textPrimary }}>
        {label}
      </Text>
    </Pressable>
  );
}