import { Platform, Alert } from 'react-native';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import type { ScoreSheetData } from '@/components/results/score-sheet/scoreSheet.types';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const exportScoreSheetExcel = async (data: ScoreSheetData) => {
  const playerName = (slot: ScoreSheetData['participants'][number]['slot'] | null) =>
    slot === null ? 'Unavailable' :
    data.participants.find(player => player.slot === slot)?.name || '—';
  const sideName = (side: ScoreSheetData['winnerSide']) =>
    data.participants.filter(player => player.side === side).map(player => player.name).join(' / ') || '—';
  const sideLabel = (side: ScoreSheetData['winnerSide']) =>
    data.matchType === 'DOUBLES'
      ? (side === 'TEAM1' ? 'Team A' : 'Team B')
      : (side === 'TEAM1' ? 'Player 1' : 'Player 2');
  const winnerName = (winner: ScoreSheetData['participants'][number]['slot'] | ScoreSheetData['winnerSide']) =>
    winner === 'TEAM1' || winner === 'TEAM2'
      ? `${winner === 'TEAM1' ? 'Team A' : 'Team B'}: ${sideName(winner)}`
      : playerName(winner);
  const rows: (string | number)[][] = [
    ['TENNIS SCORE SHEET'],
    ['NON-CERTIFIED'],
    [],
    ['Match ID', data.matchId],
    ['Match number', data.matchNumber ?? '—'],
    ['Event / category', data.metadata.event ?? '—'],
    ['Age category', data.metadata.ageCategory ?? '—'],
    ['Gender', data.metadata.gender ?? '—'],
    ['Tournament code', data.metadata.tournamentCode ?? '—'],
    ['Round', data.metadata.round ?? '—'],
    ['Court', data.metadata.court ?? '—'],
    ['Scheduled date', data.metadata.scheduledDate ?? '—'],
    ['Format', data.matchType === 'DOUBLES' ? 'Doubles' : 'Singles'],
    ['Number of sets', data.matchFormat === 'BEST_OF_5' ? 'Best of 5' : 'Best of 3'],
    [],
    ['PARTICIPANTS'],
    ['Side', 'Player slot', 'Name'],
    ...data.participants.map(player => [sideLabel(player.side), player.slot, player.name]),
    [],
    ['RESULT'],
    ['Winner', sideLabel(data.winnerSide), sideName(data.winnerSide)],
    ['Set', sideLabel('TEAM1'), sideLabel('TEAM2'), 'Tie-break A', 'Tie-break B'],
    ...data.completedSets.map((set, index) => [
      index + 1, set.player1Games, set.player2Games,
      set.wasTiebreak ? (set.tiebreakPlayer1Points ?? '—') : '—',
      set.wasTiebreak ? (set.tiebreakPlayer2Points ?? '—') : '—',
    ]),
    ...(data.completedSets.length === 0 ? [['Set scores', '—']] : []),
    ['A = Player 1 / Team A; B = Player 2 / Team B'],
    [],
    ['SAVED SERVING INFORMATION'],
    ['Saved server', data.serving.currentServer,
      data.participants.find(player => player.slot === data.serving.currentServer)?.name ?? '—'],
    [],
    ['TIMING'],
    ['Scheduled time', data.timing.scheduledTime ?? '—'],
    ['Maximum recorded elapsed seconds', data.timing.maxRecordedElapsedSeconds ?? '—'],
    ['Recorded elapsed time is not an official match duration.'],
    ['Actual start and finish times are unavailable.'],
    [],
    ['ASSIGNED OFFICIALS'],
  ];
  const officials: [string, number | null][] = [
    ['Digital scorer ID', data.officials.digitalScorerId],
    ['Referee 1 ID', data.officials.referee1Id],
    ['Referee 2 ID', data.officials.referee2Id],
    ['Umpire ID', data.officials.umpireId],
  ];
  const assignedOfficials = officials.filter(([, id]) => id !== null);
  rows.push(...assignedOfficials.map(([label, id]) => [label, id ?? '—']));
  if (assignedOfficials.length === 0) rows.push(['—']);
  rows.push([], ['DETAILED RECORDING', data.recording.status], ['NON-CERTIFIED']);
  if ((data.recording.status === 'VALIDATED' || data.recording.status === 'PARTIAL')) {
    if (data.recording.status === 'PARTIAL') {
      rows.push(['Limitations'], ...data.recording.limitations.map(limitation => [limitation]));
    }
    rows.push(['Event count', data.recording.eventCount], ['Point count', data.recording.pointCount]);
    rows.push(['FAULT and SERVE do not award points.']);
    rows.push(['Set', 'Game', 'Server', 'Point', 'Score', data.matchType === 'DOUBLES' ? 'Winning Team' : 'Point Winner', 'Event', 'Event Number']);
    for (const set of data.recording.sets) {
      for (const game of set.games) {
        for (const point of game.points) {
          rows.push([set.number, game.isTiebreak ? `${game.number} (tie-break)` : game.number,
            playerName(point.server), point.number,
            point.scoreAfterPoint === 'GAME' ? `GAME ${winnerName(point.winner)}` : point.scoreAfterPoint,
            winnerName(point.winner), point.event.type, point.eventNumber]);
        }
      }
    }
  } else {
    rows.push(['Reason', data.recording.reason]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet['!cols'] = [{ wch: 42 }, { wch: 25 }, { wch: 38 }, { wch: 16 }, { wch: 30 }, { wch: 30 }, { wch: 22 }, { wch: 16 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Scoresheet');

  const matchFileId = (data.matchNumber || data.matchId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `scoresheet_match_${matchFileId}.xlsx`;

  if (Platform.OS === 'web') {
    XLSX.writeFile(workbook, fileName);
    return { fileUri: '', fileName };
  }

  // Native (Android / iOS)
  const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' }) as string;
  const dir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
  if (!dir) throw new Error('No writable directory is available for the score sheet.');
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
    Alert.alert('Export Successful', `Score sheet saved to: ${fileUri}`);
  }

  return { fileUri, fileName };
};
