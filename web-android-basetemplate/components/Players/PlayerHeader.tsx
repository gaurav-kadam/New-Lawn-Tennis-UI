import { Text, View } from 'react-native';
import { useTheme } from '@/theme/themeContext';
import { tokens } from '@/theme/token';
import Button from '../ui/Button';

type Props = {
  onEdit?: () => void;
};

export default function PlayerHeader({ onEdit }: Props) {
  const theme = useTheme();

  return (
    <View style={{
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: tokens.radius.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      ...tokens.shadow.light,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: theme.typography.sizes.h3,
          fontWeight: '700',
          color: theme.colors.textPrimary,
          fontFamily: theme.typography.fontFamily,
        }}>
          Players
        </Text>
        <Text style={{
          fontSize: theme.typography.sizes.caption,
          color: theme.colors.textSecondary,
          marginTop: 2,
          fontFamily: theme.typography.fontFamily,
        }}>
          Manage players
        </Text>
      </View>
      <Button title="+ New Player" variant="outline" size="sm" onPress={onEdit} />
    </View>
  );
}
