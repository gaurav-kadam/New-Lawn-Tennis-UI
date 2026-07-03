import { Platform, Alert } from 'react-native';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { ScoreSheetData } from '@/components/results/score-sheet/scoreSheet.types';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const exportScoreSheetExcel = async (data: ScoreSheetData) => {
  const rows = [
    ['SCORESHEET'],
    [],
    ['Match No', data.matchNumber],
    ['Sport / Weight / Round', data.sportWeightRound],
    ['Referee', data.referee],
    ['Judge', data.judge],
    ['Mat Chairman', data.matChairman],
    [],
    ['RED'],
    ['Name', data.redName],
    ['Country', data.redCountry],
    ['No', data.redNo],
    ['1st Period Technical Points', data.redPeriod1],
    ['2nd Period Technical Points', data.redPeriod2],
    ['Total Technical Points', data.redTotal],
    ['Classification Points', data.redClassificationPoints],
    [],
    ['BLUE'],
    ['Name', data.blueName],
    ['Country', data.blueCountry],
    ['No', data.blueNo],
    ['1st Period Technical Points', data.bluePeriod1],
    ['2nd Period Technical Points', data.bluePeriod2],
    ['Total Technical Points', data.blueTotal],
    ['Classification Points', data.blueClassificationPoints],
    [],
    ['Winner', data.winner],
    ['Finish Time', data.finishTime],
    ['Result', data.resultType],
    [],
    ['SIGNATURE', ''],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet['!cols'] = [{ wch: 32 }, { wch: 38 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Scoresheet');

  const fileName = `scoresheet_match_${data.matchNumber || Date.now()}.xlsx`;

  if (Platform.OS === 'web') {
    XLSX.writeFile(workbook, fileName);
    return { fileUri: '', fileName };
  }

  // Native (Android / iOS)
  const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' }) as string;
  const dir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? '';
  const fileUri = dir + fileName;

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(fileUri, {
      mimeType: XLSX_MIME,
      dialogTitle: 'Share Scoresheet',
      UTI: 'com.microsoft.excel.xlsx',
    });
  } else {
    Alert.alert('Export Successful', 'File saved to your documents folder.');
  }

  return { fileUri, fileName };
};