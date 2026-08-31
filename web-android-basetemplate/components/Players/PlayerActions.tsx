import { Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/theme/themeContext';

export default function PlayerActions({
  player,
  onEdit,
  onDelete,
}: any) {
  const theme = useTheme();

  if (!player) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
      }}
    >
      {onEdit && (
        <TouchableOpacity onPress={() => onEdit(player)}>
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
      )}

      {onDelete && (
        <TouchableOpacity onPress={() => onDelete(player.id)}>
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
      )}
    </View>
  );
}