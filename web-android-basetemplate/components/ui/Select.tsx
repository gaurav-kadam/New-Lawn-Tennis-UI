import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../theme/themeContext';

export default function Select({
  label,
  options = [],
  value,
  onChange,
  error,
}: any) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const selected = options.find((o: any) => o.value === value);

  return (
    <View style={{ marginBottom: theme.spacing.md }}>

      {/* Label */}
      {label && (
        <Text style={{ marginBottom: 4, color: theme.colors.textPrimary }}>
          {label}
        </Text>
      )}

      {/* Selected Box */}
      <Pressable
        onPress={() => setOpen(!open)}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
        }}
      >
        <Text style={{ color: theme.colors.textPrimary }}>
          {selected ? selected.label : 'Select option'}
        </Text>
      </Pressable>

      {/* Options */}
      {open && (
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginTop: 4,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.surface,
          }}
        >
          {options.map((item: any) => (
            <Pressable
              key={item.value}
              onPress={() => {
                onChange(item.value);
                setOpen(false);
              }}
              style={{
                padding: theme.spacing.md,
              }}
            >
              <Text>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Error */}
      {error && (
        <Text style={{ marginTop: 4, color: theme.colors.error }}>
          {error}
        </Text>
      )}
    </View>
  );
}