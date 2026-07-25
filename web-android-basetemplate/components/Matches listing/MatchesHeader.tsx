import { Text, View } from 'react-native';

import { useTheme } from '@/theme/themeContext';

import Button from '../ui/Button';

export default function MatchesHeader({
  onEdit,
}: any) {
  const theme = useTheme();

  return (
    <View
      style={{
        marginBottom: 10,

        flexDirection: 'row',

        alignItems: 'center',

        backgroundColor: '#FFFFFF',

        borderWidth: 1,
        borderColor: 'rgba(15,23,42,0.06)',

        padding: theme.spacing.md,

        borderRadius: 18,
      }}
    >
      <View
        style={{
          flex: 1,

          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',

            color: theme.colors.textPrimary,

            fontSize: theme.typography.sizes.h2,
          }}
        >
          Match Management
        </Text>

        <Text
          style={{
            color: theme.colors.textSecondary,

            marginTop: 4,

            fontSize:
              theme.typography.sizes.small,
          }}
        >
          Search, create, update, and manage registered matches.
        </Text>
      </View>

      <View>
        <Button
          title="+ New Match"
          variant="outline"
          size="sm"
          onPress={() => onEdit(true)}
        />
      </View>
    </View>
  );
}