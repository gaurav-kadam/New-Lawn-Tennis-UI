import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../theme/themeContext';

export default function RadioGroup({
  label,
  options = [],
  value,
  onChange,
  error,
}: any) {
  const theme = useTheme();

  return (
    <View style={{ marginBottom: theme.spacing.md }}>

      {/* Label */}
      {label && (
        <Text
          style={{
            marginBottom: 6,
            color: theme.colors.textPrimary,
            fontSize: theme.typography.small,
          }}
        >
          {label}
        </Text>
      )}

      {/* Options */}
      <View style={{ gap: 10 }}>
        {options.map((item: any) => {
          const selected = value === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => onChange(item.value)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {/* Circle */}
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  borderWidth: 2,
                  borderColor: selected
                    ? theme.colors.primary
                    : theme.colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selected && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.colors.primary,
                    }}
                  />
                )}
              </View>

              {/* Label */}
              <Text style={{ color: theme.colors.textPrimary }}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Error */}
      {error && (
        <Text
          style={{
            marginTop: 4,
            color: theme.colors.error,
            fontSize: theme.typography.small,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}