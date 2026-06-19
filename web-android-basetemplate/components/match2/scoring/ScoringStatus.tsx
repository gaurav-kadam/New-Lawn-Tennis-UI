import { Wrestler } from '@/components/match';
import { useTheme } from '@/theme/themeContext';
import { Text, View } from 'react-native';

type Props = {
  selectedWrestler: Wrestler | null;
  selectedMove: string | null;
  selectedPoints: number | null;
};

export default function ScoringStatus({
  selectedWrestler,
  selectedMove,
  selectedPoints,
}: Props) {
  const theme = useTheme();

  return (
    <View
      style={{
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.background,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
      }}
    >
      <Text>Wrestler: {selectedWrestler ?? 'None'}</Text>
      <Text>Move: {selectedMove ?? 'None'}</Text>
      <Text>Score: {selectedPoints ?? 'None'}</Text>
    </View>
  );
}