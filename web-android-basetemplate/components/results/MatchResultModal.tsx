import React, { useMemo, useState } from 'react';
import { Modal, Text, View } from 'react-native';

import Button from '@/components/ui/Button';
import { useTheme } from '@/theme/themeContext';

import { ResultType, ScoreSheetData } from './score-sheet/scoreSheet.types';
import ScoreSheetPreview from './score-sheet/ScoreSheetPreview';
import { getClassificationPoints } from './score-sheet/scoreSheetRules';
import { SessionResult } from './types';

type Props = {
  visible: boolean;
  results: SessionResult[];
  onClose: () => void;
};

export default function MatchResultModal({
  visible,
  results,
  onClose,
}: Props) {
  const theme = useTheme();

  const [scoreSheetOpen, setScoreSheetOpen] = useState(false);
  const [resultType] = useState<ResultType>('PP');

  const redTotal = results.reduce(
    (sum, item) => sum + item.redScore,
    0
  );

  const blueTotal = results.reduce(
    (sum, item) => sum + item.blueScore,
    0
  );

  const winner =
    redTotal > blueTotal
      ? 'RED'
      : blueTotal > redTotal
        ? 'BLUE'
        : '';

  const classification = getClassificationPoints(
    resultType,
    winner
  );

  const scoreSheetData: ScoreSheetData = useMemo(
    () => ({
      matchNumber: 'M-001',
      sportWeightRound: 'KUSHTI / 74KG / FINAL',

      referee: 'Referee',
      judge: 'Judge',
      matChairman: 'Mat Chairman',

      redName: 'Red Wrestler',
      redCountry: 'IND',
      redNo: '1',

      blueName: 'Blue Wrestler',
      blueCountry: 'IND',
      blueNo: '2',

      redPeriod1: results[0]?.redScore ?? 0,
      redPeriod2: results[1]?.redScore ?? 0,

      bluePeriod1: results[0]?.blueScore ?? 0,
      bluePeriod2: results[1]?.blueScore ?? 0,

      redTotal,
      blueTotal,

      redClassificationPoints:
        classification.redClassificationPoints,
      blueClassificationPoints:
        classification.blueClassificationPoints,

      winner,
      finishTime: new Date().toLocaleTimeString(),

      resultType,
    }),
    [results, redTotal, blueTotal, winner, classification, resultType]
  );

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: `${theme.colors.textPrimary}73`,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.lg,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: theme.spacing.xl * 16,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.xl,
              ...theme.shadow.medium,
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.sizes.h2,
                fontWeight: '900',
                color: theme.colors.textPrimary,
                textAlign: 'center',
              }}
            >
              Match Result
            </Text>

            <Text
              style={{
                marginTop: theme.spacing.md,
                fontSize: theme.typography.sizes.h3,
                color: theme.colors.textPrimary,
                textAlign: 'center',
                fontWeight: '800',
              }}
            >
              Winner: {winner || 'Draw'}
            </Text>

            <Text
              style={{
                marginTop: theme.spacing.sm,
                color: theme.colors.textSecondary,
                textAlign: 'center',
              }}
            >
              Final Score: RED {redTotal} - BLUE {blueTotal}
            </Text>

            <View style={{ marginTop: theme.spacing.lg }}>
              {results.map((item) => (
                <Text
                  key={item.session}
                  style={{
                    color: theme.colors.textSecondary,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  Session {item.session}: RED {item.redScore} - BLUE{' '}
                  {item.blueScore}
                </Text>
              ))}
            </View>

            <View
  style={{
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  }}
>
  <View style={{ flex: 1 }}>
    <Button
      title="View Score Sheet"
      variant="primary"
      onPress={() => setScoreSheetOpen(true)}
    />
  </View>

  <View style={{ flex: 1 }}>
    <Button
      title="Close"
      variant="outline"
      onPress={onClose}
    />
  </View>
</View>
          </View>
        </View>
      </Modal>

      <ScoreSheetPreview
        visible={scoreSheetOpen}
        data={scoreSheetData}
        onClose={() => setScoreSheetOpen(false)}
      />
    </>
  );
}