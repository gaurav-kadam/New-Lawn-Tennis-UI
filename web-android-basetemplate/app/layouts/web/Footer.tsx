import { Text, View } from 'react-native';

export default function Footer({ theme }: any) {
  return (
    <View
      style={{
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Text style={{ color: theme.colors.textSecondary }}>
        © 2026 Your Company
      </Text>
    </View>
  );
}