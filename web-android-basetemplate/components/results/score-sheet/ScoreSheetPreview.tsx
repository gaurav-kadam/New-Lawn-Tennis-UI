import React from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';

import Button from '@/components/ui/Button';
import { useTheme } from '@/theme/themeContext';

import { ScoreSheetData } from './scoreSheet.types';
import { exportScoreSheetExcel } from '@/utils/exportScoreSheetExcel';
type Props = {
  visible: boolean;
  data: ScoreSheetData;
  onClose: () => void;
};

export default function ScoreSheetPreview({
  visible,
  data,
  onClose,
}: Props) {
  const theme = useTheme();

  const handleExportExcel = async () => {
  await exportScoreSheetExcel(data);
};

  const Cell = ({
    children,
    flex = 1,
    bold = false,
  }: {
    children: React.ReactNode;
    flex?: number;
    bold?: boolean;
  }) => (
    <View
      style={{
        flex,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.sm,
        minHeight: theme.spacing.xl,
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: theme.typography.sizes.small,
          fontWeight: bold ? '800' : '500',
          color: theme.colors.textPrimary,
        }}
      >
        {children}
      </Text>
    </View>
  );

  return (
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
            maxWidth: theme.spacing.xl * 28,
            maxHeight: '92%',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.lg,
          }}
        >
          <ScrollView showsVerticalScrollIndicator>
            <Text
              style={{
                textAlign: 'right',
                fontSize: theme.typography.sizes.h3,
                fontWeight: '900',
                color: theme.colors.textPrimary,
                marginBottom: theme.spacing.md,
              }}
            >
              SCORESHEET
            </Text>

            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
              <Cell>Match No: {data.matchNumber}</Cell>
              <Cell flex={2} bold>
                {data.sportWeightRound}
              </Cell>
              <Cell>Referee: {data.referee}</Cell>
            </View>

            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
              <Cell flex={2}>Judge: {data.judge}</Cell>
              <Cell flex={2}>Mat Chairman: {data.matChairman}</Cell>
            </View>

            <View
              style={{
                flexDirection: 'row',
                gap: theme.spacing.md,
                marginTop: theme.spacing.lg,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    backgroundColor: theme.colors.error,
                    color: theme.colors.surface,
                    textAlign: 'center',
                    padding: theme.spacing.sm,
                    fontWeight: '900',
                  }}
                >
                  RED
                </Text>

                <View style={{ flexDirection: 'row' }}>
                  <Cell flex={2}>Name: {data.redName}</Cell>
                  <Cell>Country: {data.redCountry}</Cell>
                  <Cell>No: {data.redNo}</Cell>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Cell>1st</Cell>
                  <Cell flex={2}>Technical Points</Cell>
                  <Cell>{data.redPeriod1}</Cell>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Cell>2nd</Cell>
                  <Cell flex={2}>Technical Points</Cell>
                  <Cell>{data.redPeriod2}</Cell>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.surface,
                    textAlign: 'center',
                    padding: theme.spacing.sm,
                    fontWeight: '900',
                  }}
                >
                  BLUE
                </Text>

                <View style={{ flexDirection: 'row' }}>
                  <Cell flex={2}>Name: {data.blueName}</Cell>
                  <Cell>Country: {data.blueCountry}</Cell>
                  <Cell>No: {data.blueNo}</Cell>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Cell>1st</Cell>
                  <Cell flex={2}>Technical Points</Cell>
                  <Cell>{data.bluePeriod1}</Cell>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Cell>2nd</Cell>
                  <Cell flex={2}>Technical Points</Cell>
                  <Cell>{data.bluePeriod2}</Cell>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                gap: theme.spacing.lg,
                marginTop: theme.spacing.lg,
              }}
            >
              <Cell>
                Technical Points Total RED: {data.redTotal}
              </Cell>
              <Cell>
                Technical Points Total BLUE: {data.blueTotal}
              </Cell>
            </View>

            <View
              style={{
                flexDirection: 'row',
                gap: theme.spacing.lg,
                marginTop: theme.spacing.md,
              }}
            >
              <Cell>
                RED Classification Points: {data.redClassificationPoints}
              </Cell>
              <Cell>
                BLUE Classification Points: {data.blueClassificationPoints}
              </Cell>
            </View>

            <View
              style={{
                flexDirection: 'row',
                gap: theme.spacing.md,
                marginTop: theme.spacing.lg,
              }}
            >
              <Cell flex={2} bold>
                Winner: {data.winner}
              </Cell>
              <Cell>Finish Time: {data.finishTime}</Cell>
              <Cell>Result: {data.resultType}</Cell>
            </View>

            <Text
              style={{
                marginTop: theme.spacing.xl,
                textAlign: 'right',
                color: theme.colors.textSecondary,
                fontWeight: '700',
              }}
            >
              SIGNATURE
            </Text>
          </ScrollView>

          <View
  style={{
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  }}
>
  <View style={{ flex: 1 }}>
    <Button
      title="Export Excel"
      variant="primary"
      onPress={handleExportExcel}
    />
  </View>

  <View style={{ flex: 1 }}>
    <Button
      title="Close"
      variant="danger"
      onPress={onClose}
    />
  </View>
</View>
        </View>
      </View>
    </Modal>
  );
}