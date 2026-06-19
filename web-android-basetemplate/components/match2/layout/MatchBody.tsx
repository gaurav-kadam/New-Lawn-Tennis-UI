import React, { useMemo, useState } from 'react';
import { Platform, Text, View } from 'react-native';

import { MOVE_IMAGES } from '@/components/constants/moveImages';
import { PointType, SCORING_MOVES } from '@/components/constants/scoringMoves';
import MatchSidePanel from '@/components/match/side-panel/MatchSidePanel';
import { MatchEvent, Wrestler } from '@/components/match/types/match.types';
import { useTheme } from '@/theme/themeContext';
import CustomMoveModal from '../scoring/CustomMoveModal';
import MoveSelector from '../scoring/MoveSelector';
import PointTypeSelector from '../scoring/PointTypeSelector';
import RemarksInput from '../scoring/RemarksInput';
import ScoreSelector from '../scoring/ScoreSelector';
import ScoringStatus from '../scoring/ScoringStatus';

type Props = {
  selectedWrestler: Wrestler | null;
  logs: MatchEvent[];
  running: boolean;
  onAddEvent: (event: MatchEvent) => void;
};


export default function MatchBody({
  selectedWrestler,
  logs,
  running,
  onAddEvent,
}: Props) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [selectedType, setSelectedType] =
    useState<PointType>('ATTACKING');

  const [selectedMove, setSelectedMove] =
    useState<string | null>(null);

  const [selectedPoints, setSelectedPoints] =
    useState<number | null>(null);

  const [customMove, setCustomMove] = useState('');
  const [remarks, setRemarks] = useState('');
  const [customMoveModalOpen, setCustomMoveModalOpen] =
    useState(false);

  const [movesData, setMovesData] =
    useState<Record<PointType, string[]>>(SCORING_MOVES);

  const currentMoves = movesData[selectedType];

  const canSave = useMemo(() => {
    return (
      selectedWrestler !== null &&
      selectedMove !== null &&
      selectedPoints !== null
    );
  }, [selectedWrestler, selectedMove, selectedPoints]);

  const selectType = (type: PointType) => {
    setSelectedType(type);
    setSelectedMove(null);
    setSelectedPoints(null);
  };

  const addCustomMove = () => {
    const value = customMove.trim();

    if (!value) return;

    setMovesData((prev) => ({
      ...prev,
      [selectedType]: [...prev[selectedType], value],
    }));

    setSelectedMove(value);
    setCustomMove('');
  };

  const saveEvent = () => {
    if (!running) {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.alert('Start the timer before awarding points');
      }

      return;
    }

    if (
      !canSave ||
      !selectedWrestler ||
      !selectedMove ||
      selectedPoints === null
    ) {
      return;
    }

    onAddEvent({
      id: Date.now().toString(),
      wrestler: selectedWrestler,
      type: selectedType,
      move: selectedMove,
      points: selectedPoints,
      remarks,
    });

    setSelectedMove(null);
    setSelectedPoints(null);
    setRemarks('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoringArea}>
        <View style={styles.panel}>
          <ScoringStatus
            selectedWrestler={selectedWrestler}
            selectedMove={selectedMove}
            selectedPoints={selectedPoints}
          />

          <Text style={styles.sectionTitle}>Point Type</Text>

          <PointTypeSelector
            selectedType={selectedType}
            onSelect={selectType}
          />

          <Text style={styles.sectionTitle}>Select Move</Text>

          <MoveSelector
            moves={currentMoves}
            selectedMove={selectedMove}
            moveImages={MOVE_IMAGES}
            onSelect={setSelectedMove}
            onAddCustom={() => setCustomMoveModalOpen(true)}
          />

          <Text style={styles.sectionTitle}>Select Score</Text>

          <ScoreSelector
            selectedPoints={selectedPoints}
            onSelect={setSelectedPoints}
          />

          <Text style={styles.sectionTitle}>Remarks</Text>

          <RemarksInput
            value={remarks}
            onChangeText={setRemarks}
            canSave={canSave}
            onSave={saveEvent}
          />
        </View>
      </View>

      <MatchSidePanel logs={logs} />

      <CustomMoveModal
        visible={customMoveModalOpen}
        value={customMove}
        onChangeText={setCustomMove}
        onClose={() => {
          setCustomMove('');
          setCustomMoveModalOpen(false);
        }}
        onAdd={() => {
          addCustomMove();
          setCustomMoveModalOpen(false);
        }}
      />
    </View>
  );
}

const createStyles = (theme: any) => ({
  container: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'stretch' as const,
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
    overflow: 'hidden' as const,
  },

  scoringArea: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: theme.spacing.sm,
  },

  panel: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    overflow: 'hidden' as const,
    backgroundColor: theme.colors.surface,
    ...theme.shadow.medium,
  },

  sectionTitle: {
    fontWeight: '700' as const,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.small,
    fontFamily: theme.typography.fontFamily,
  },
});