import React from 'react';
import { View, Text, Modal, Platform, Alert } from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { generateMatchWorkbook } from '../../match/controls/excelUtils';
import { useMatch } from '../layout/MatchContext';

interface MatchResultModalProps {
  isVisible: boolean;
  onClose: () => void;
  scoreA: number;
  scoreB: number;
  whiteTeamName: string;
  blueTeamName: string;
  getQuarterScore: (teamSide: 'left' | 'right', quarter: number) => number;
}

export default function MatchResultModal({
  isVisible,
  onClose,
  scoreA,
  scoreB,
  whiteTeamName,
  blueTeamName,
}: MatchResultModalProps) {
  const theme = useTheme();
  const { finalizeAndEndMatch } = useMatch();

  const winnerString = scoreA > scoreB
    ? `${whiteTeamName} (WHITE) Wins!`
    : scoreB > scoreA
      ? `${blueTeamName} (BLUE) Wins!`
      : "Match is a Draw!";

  const handleSubmitAndDownload = async () => {
    const targetFilename = `Waterpolo_Scoresheet_${Date.now()}.xlsx`;

    try {
      const workbook = await generateMatchWorkbook();
      const buffer = await workbook.xlsx.writeBuffer();

      if (Platform.OS === 'web') {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const anchor = document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = targetFilename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      } else {
        const uint8 = new Uint8Array(buffer as ArrayBuffer);
        const file = new FileSystem.File(FileSystem.Paths.cache, targetFilename);
        file.create({ overwrite: true });
        file.write(uint8);

        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(file.uri, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Share Match Scoresheet',
            UTI: 'com.microsoft.excel.xlsx',
          });
        } else {
          Alert.alert("Export Successful", "File generated but system sharing is restricted.");
        }
      }

      await finalizeAndEndMatch();
      onClose();
    } catch (exportSystemError) {
      console.error(exportSystemError);
      Alert.alert("Processing Error", "Failed to compile structure into an Excel document.");
    }
  };

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
      {/* ... keeping the rest of your unchanged layout structure ... */}
      <View style={{ flex: 1, backgroundColor: theme.colors.overlay || 'rgba(15, 23, 42, 0.75)', justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg }}>
        <View style={{ width: '100%', maxWidth: 420 }}>
          <Card variant="elevated">
            <View style={{ alignItems: 'center', width: '100%' }}>
              
              <Text style={{ color: theme.colors.error, fontSize: theme.typography.sizes.badge, fontWeight: theme.typography.weights.heavy as any, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: theme.spacing.xs }}>
                Match Finished
              </Text>
              
              <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.h3, fontWeight: theme.typography.weights.bold as any, textAlign: 'center', marginBottom: theme.spacing.lg }}>
                Result: {winnerString}
              </Text>

              <View style={{ backgroundColor: theme.colors.secondary, width: '100%', borderRadius: theme.radius.sm, paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.lg, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.small, fontWeight: '700', textAlign: 'center' }}>{whiteTeamName}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing.sm }}>
                    <Text style={{ fontSize: theme.typography.sizes.h1, fontWeight: '900', color: theme.colors.textPrimary }}>{scoreA}</Text>
                    <Text style={{ fontSize: theme.typography.sizes.h2, fontWeight: '700', color: theme.colors.border, marginHorizontal: theme.spacing.sm }}>—</Text>
                    <Text style={{ fontSize: theme.typography.sizes.h1, fontWeight: '900', color: theme.colors.textPrimary }}>{scoreB}</Text>
                  </View>

                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.small, fontWeight: '700', textAlign: 'center' }}>{blueTeamName}</Text>
                  </View>
                </View>
              </View>

              <View style={{ width: '100%' }}>
                <Button title="Submit & Export Scoresheet" variant="danger" onPress={handleSubmitAndDownload} style={{ width: '100%' }} />
              </View>

            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
}