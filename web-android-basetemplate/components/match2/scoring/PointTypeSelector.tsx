import { View } from 'react-native';

import {
    POINT_TYPES,
    PointType,
} from '@/components/constants/scoringMoves';
import MatchChip from '@/components/match/controls/MatchChip';
import { useTheme } from '@/theme/themeContext';

type Props = {
  selectedType: PointType;
  onSelect: (type: PointType) => void;
};

export default function PointTypeSelector({
  selectedType,
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
      {POINT_TYPES.map((type) => (
        <MatchChip
          key={type}
          label={type}
          icon={
            type === 'ATTACKING'
              ? 'flash'
              : type === 'DEFENDING'
                ? 'shield-checkmark'
                : type === 'PENALTY'
                  ? 'warning'
                  : 'trophy'
          }
          active={selectedType === type}
          onPress={() => onSelect(type)}
        />
      ))}
    </View>
  );
}