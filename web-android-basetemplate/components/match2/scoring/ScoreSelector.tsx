import { View } from 'react-native';

import { SCORE_OPTIONS } from '@/components/constants/scoringMoves';
import MatchChip from '@/components/match/controls/MatchChip';
import { useTheme } from '@/theme/themeContext';

type Props = {
  selectedPoints: number | null;
  onSelect: (points: number) => void;
};

export default function ScoreSelector({
  selectedPoints,
  onSelect,
}: Props) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
      }}
    >
      {SCORE_OPTIONS.filter((points) => points !== 3).map((points) => (
        <MatchChip
          key={points}
          label={points}
          active={selectedPoints === points}
          onPress={() => onSelect(points)}
        />
      ))}
    </View>
  );
}