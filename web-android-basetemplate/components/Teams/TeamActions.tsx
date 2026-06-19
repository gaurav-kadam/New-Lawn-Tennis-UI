import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/themeContext';

export default function TeamActions({
  tournament,
  onEdit,
  onDelete,
}: any) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
      }}
    >
      <TouchableOpacity onPress={() => onEdit(tournament)}>
        <Text
          style={{
            color: theme.colors.primary,
            fontWeight: '700',
            fontSize: 14,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          UPDATE
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onDelete(tournament.id)}>
        <Text
          style={{
            color: theme.colors.error,
            fontWeight: '700',
            fontSize: 14,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          DELETE
        </Text>
      </TouchableOpacity>
    </View>
  );
}