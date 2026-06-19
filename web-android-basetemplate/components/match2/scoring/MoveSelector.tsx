import { View } from 'react-native';

import MatchChip from '@/components/match/controls/MatchChip';
import { useTheme } from '@/theme/themeContext';

type Props = {
  moves: string[];
  selectedMove: string | null;
  moveImages: Record<string, any>;
  onSelect: (move: string) => void;
  onAddCustom: () => void;
};

export default function MoveSelector({
  moves,
  selectedMove,
  moveImages,
  onSelect,
  onAddCustom,
}: Props) {
  const theme = useTheme();

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        gap: theme.spacing.sm,
      }}
    >
      {moves.map((move) => (
        <MatchChip
          key={move}
          label={move}
          image={moveImages[move]}
          active={selectedMove === move}
          onPress={() => onSelect(move)}
        />
      ))}

      <MatchChip
        label="+"
        active={false}
        onPress={onAddCustom}
      />
    </View>
  );
}