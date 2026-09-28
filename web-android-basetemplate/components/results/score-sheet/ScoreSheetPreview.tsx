import React, { useId, useRef, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTheme } from '@/theme/themeContext';
import type { ScoreSheetData } from './scoreSheet.types';
import { exportScoreSheetExcel } from '@/utils/exportScoreSheetExcel';

type Props = {
  visible: boolean;
  data: ScoreSheetData;
  onClose: () => void;
};

export default function ScoreSheetPreview({ visible, data, onClose }: Props) {
  const theme = useTheme();
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [exportingPdf, setExportingPdf] = useState(false);
  const pdfInProgress = useRef(false);
  const documentId = `score-sheet-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  let printBlockIndex = 0;
  const keepTogether = () => ({ nativeID: `${documentId}-keep-${printBlockIndex++}` });
  const handleDownloadPdf = async () => {
    if (pdfInProgress.current || Platform.OS !== 'web') return;
    pdfInProgress.current = true;
    setExportingPdf(true);
    setExportError('');
    try {
      const element = document.getElementById(documentId);
      if (!element) throw new Error('Score sheet is not mounted');
      const matchLabel = (data.matchNumber?.trim() || data.matchId).replace(/[^a-zA-Z0-9_-]/g, '_') || 'match';
      await downloadScoreSheetPdf(element, `Tennis_Score_Sheet_${matchLabel}.pdf`);
    } catch {
      setExportError('Unable to download the PDF. Please keep the score sheet open and try again.');
    } finally {
      pdfInProgress.current = false;
      setExportingPdf(false);
    }
  };
  const handleExportExcel = async () => {
    setExporting(true);
    setExportError('');
    try {
      await exportScoreSheetExcel(data);
    } catch {
      setExportError('Unable to export the score sheet. Please try again.');
    } finally {
      setExporting(false);
    }
  };
  const sideName = (side: ScoreSheetData['winnerSide']) =>
    data.participants
      .filter((player) => player.side === side)
      .map((player) => player.name)
      .join(' / ') || '—';
  const playerName = (
    slot: ScoreSheetData['participants'][number]['slot'] | null
  ) =>
    slot === null
      ? '—'
      : data.participants.find((player) => player.slot === slot)?.name || '—';
  const winnerName = (
    winner:
      | ScoreSheetData['participants'][number]['slot']
      | ScoreSheetData['winnerSide']
  ) =>
    winner === 'TEAM1' || winner === 'TEAM2'
      ? sideName(winner)
      : playerName(winner);
  const winnerCode = (
    winner:
      | ScoreSheetData['participants'][number]['slot']
      | ScoreSheetData['winnerSide']
  ) =>
    winner === 'TEAM1'
      ? 'Team 1'
      : winner === 'TEAM2'
        ? 'Team 2'
        : winner.replace('PLAYER', 'P');
  const serverCode = (
    slot: ScoreSheetData['participants'][number]['slot'] | null
  ) => (slot === null ? '—' : slot.replace('PLAYER', 'P'));
  const textStyle = [styles.text, { fontFamily: theme.typography.fontFamily }];
  const recording = data.recording;
  const detailed =
    recording.status === 'VALIDATED' || recording.status === 'PARTIAL'
      ? recording
      : null;
  const sideLabel = (side: ScoreSheetData['winnerSide']) =>
    data.matchType === 'DOUBLES'
      ? side === 'TEAM1'
        ? 'Team 1'
        : 'Team 2'
      : side === 'TEAM1'
        ? 'Player 1'
        : 'Player 2';
  const field = (label: string, value: string | number | null, flex = 1) => (
    <View key={label} style={[styles.field, { flex }]}>
      <Text style={[textStyle, styles.label]}>{label}</Text>
      <Text style={textStyle}>{value ?? '—'}</Text>
    </View>
  );
  const section = (label: string) => (
    <Text nativeID={`${documentId}-heading-${printBlockIndex++}`} accessibilityRole="header" style={[textStyle, styles.section]}>
      {label}
    </Text>
  );
  const scoreColumns = Array.from({ length: data.matchFormat === 'BEST_OF_5' ? 5 : 3 }, (_, index) => index);
  const scoreTable = (title: string) => (
    <View style={styles.box}>
      <View {...keepTogether()} style={[styles.row, styles.shaded]}>
        <Text style={[textStyle, styles.scoreName, styles.bold]}>{title}</Text>
        {scoreColumns.map(index => <Text key={index} style={[textStyle, styles.scoreCell]}>Set {index + 1}</Text>)}
      </View>
      {(['TEAM1', 'TEAM2'] as const).map(side => (
        <View key={side} {...keepTogether()} style={styles.row}>
          <Text style={[textStyle, styles.scoreName]}>{sideName(side)}</Text>
          {scoreColumns.map(index => {
            const set = data.completedSets[index];
            return <Text key={index} style={[textStyle, styles.scoreCell]}>{set ? (side === 'TEAM1' ? set.player1Games : set.player2Games) : '—'}</Text>;
          })}
        </View>
      ))}
      {data.completedSets.some(set => set.wasTiebreak) && <View {...keepTogether()} style={styles.row}>
        <Text style={[textStyle, styles.scoreName]}>Tie-break</Text>
        {scoreColumns.map(index => {
          const set = data.completedSets[index];
          return <Text key={index} style={[textStyle, styles.scoreCell]}>{set?.wasTiebreak ? `${set.tiebreakPlayer1Points ?? '—'}–${set.tiebreakPlayer2Points ?? '—'}` : '—'}</Text>;
        })}
      </View>}
    </View>
  );
  type SheetPoint = Extract<ScoreSheetData['recording'], { status: 'VALIDATED' | 'PARTIAL' }>['sets'][number]['games'][number]['points'][number];
  const pointCell = (point: SheetPoint | undefined, index: number, showServer = false) => (
    <View key={point?.eventNumber ?? `blank-${index}`} {...keepTogether()} style={styles.pointCell}
      accessible={!!point}
      accessibilityLabel={point ? `Point ${point.number}, score ${point.scoreAfterPoint}, ${data.matchType === 'DOUBLES' ? 'winning team' : 'winner'} ${winnerName(point.winner)}, server ${playerName(point.server)}, ${point.event.type}, event ${point.eventNumber}` : undefined}>
      <Text style={[textStyle, styles.pointText, styles.bold]}>{point?.scoreAfterPoint ?? ' '}</Text>
      <Text style={[textStyle, styles.pointIndicator]}>{point ? winnerCode(point.winner) : ' '}</Text>
      {showServer && <Text style={[textStyle, styles.pointIndicator]}>{point ? `S: ${serverCode(point.server)}` : ' '}</Text>}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <View style={styles.toolbar}>
            <Text style={[textStyle, styles.bold]}>Tennis Score Sheet</Text>
            <View style={styles.actions}>
              {Platform.OS === 'web' && (
                <Button
                  onPress={handleDownloadPdf}
                  loading={exportingPdf}
                  disabled={exportingPdf}
                  textColor="#222"
                  compact
                  accessibilityLabel="Download tennis score sheet as PDF"
                  accessibilityHint="Downloads the complete scorecard as a landscape PDF"
                >
                  Download Score Sheet (PDF)
                </Button>
              )}
              <Button
                onPress={handleExportExcel}
                loading={exporting}
                disabled={exporting}
                textColor="#222"
                compact
              >
                Export Excel
              </Button>
              <Button
                onPress={onClose}
                textColor="#222"
                compact
                accessibilityLabel="Close score sheet"
              >
                Close
              </Button>
            </View>
          </View>
          {exportError !== '' && (
            <Text
              accessibilityRole="alert"
              style={{ color: theme.colors.error, padding: 8 }}
            >
              {exportError}
            </Text>
          )}
          <ScrollView
            style={styles.viewport}
            contentContainerStyle={styles.scrollContent}
          >
            <ScrollView
              horizontal
              nestedScrollEnabled
              contentContainerStyle={styles.documentStrip}
              accessibilityLabel="Scorecard document; scroll horizontally to view all columns"
            >
              <View nativeID={documentId} style={styles.document}>
                <View style={styles.page}>
                  <View {...keepTogether()} style={styles.documentHeader}>
                    <View>
                      <Text
                        accessibilityRole="header"
                        style={[textStyle, styles.title]}
                      >
                        TENNIS SCORECARD
                      </Text>
                    </View>
                    <View>
                      <Text style={[textStyle, styles.bold]}>
                        NON-CERTIFIED · {recording.status}
                      </Text>
                    </View>
                  </View>
                  {section('EVENT')}
                  <View style={styles.box}>
                    <View {...keepTogether()} style={styles.row}>
                      {field(
                        'Tournament',
                        data.metadata.tournamentName ??
                          data.metadata.tournamentCode,
                        2
                      )}
                      {field('Round', data.metadata.round)}
                      {field('Court No.', data.metadata.court)}
                      {field('Date', data.metadata.scheduledDate)}
                      {field('Match No.', data.matchNumber)}
                    </View>
                    <View {...keepTogether()} style={styles.row}>
                      {field('Event / category', data.metadata.event, 2)}
                      {field('Age category', data.metadata.ageCategory)}
                      {field('Gender', data.metadata.gender)}
                      {field(
                        'No. of sets',
                        data.matchFormat === 'BEST_OF_5'
                          ? 'Best of 5'
                          : 'Best of 3'
                      )}
                      {field(
                        'Format',
                        data.matchType === 'DOUBLES' ? 'Doubles' : 'Singles'
                      )}
                    </View>
                    <View {...keepTogether()} style={styles.row}>
                      {field('Supervisor', data.officials.supervisor)}
                      {field('Referee 1 ID', data.officials.referee1Id)}
                      {field('Referee 2 ID', data.officials.referee2Id)}
                      {field('Chair Umpire', data.officials.chairUmpire)}
                      {field('Net Umpire', data.officials.netUmpire)}
                      {field('Line umpires', data.officials.lineUmpires)}
                    </View>
                    {(data.officials.umpireId !== null ||
                      data.officials.digitalScorerId !== null) && (
                      <View {...keepTogether()} style={styles.row}>
                        {data.officials.umpireId !== null &&
                          field('Assigned umpire ID', data.officials.umpireId)}
                        {data.officials.digitalScorerId !== null &&
                          field(
                            'Digital scorer ID',
                            data.officials.digitalScorerId
                          )}
                      </View>
                    )}
                  </View>
                  {section('MATCH')}
                  <View style={styles.matchRow}>
                    {(['TEAM1', 'TEAM2'] as const).map((side, index) => (
                      <React.Fragment key={side}>
                        {index === 1 && <Text style={[textStyle, styles.versus]}>VS.</Text>}
                        <View style={styles.box}>
                          <View {...keepTogether()} style={[styles.row, styles.shaded]}>
                            <Text style={[textStyle, styles.playerColumn, styles.tableCell]}>Player(s) / {sideLabel(side)}</Text>
                            <Text style={[textStyle, styles.countryColumn, styles.tableCell]}>Country</Text>
                            <Text style={[textStyle, styles.choiceColumn, styles.tableCell]}>Won (match)</Text>
                            <Text style={[textStyle, styles.choiceColumn, styles.tableCell]}>Elect</Text>
                          </View>
                          <View {...keepTogether()} style={styles.row}>
                            <View style={styles.playerColumn}>
                              {data.participants.filter(player => player.side === side).map(player => <Text key={player.slot} style={[textStyle, styles.tableCell]}>{player.name}</Text>)}
                            </View>
                            <View style={styles.countryColumn}>
                              {data.participants.filter(player => player.side === side).map(player => <Text key={player.slot} style={[textStyle, styles.tableCell]}>{player.country ?? '—'}</Text>)}
                            </View>
                            <Text style={[textStyle, styles.choiceColumn, styles.tableCell]}>{data.winnerSide === side ? 'Won' : '—'}</Text>
                            <Text style={[textStyle, styles.choiceColumn, styles.tableCell]}>{'—'}</Text>
                          </View>
                        </View>
                      </React.Fragment>
                    ))}
                  </View>
                  {section('RESULT')}
                  <View style={styles.box}>
                    <View {...keepTogether()} style={styles.row}>
                      {field('Time called', data.timing.calledAt)}
                      {field('Time started', data.timing.startedAt)}
                      {field('Time finished', data.timing.finishedAt)}
                      {field('Duration', data.timing.durationSeconds)}
                    </View>
                    <View {...keepTogether()} style={styles.row}>
                      {field('Winner(s)', sideName(data.winnerSide), 3)}
                      {field('Scheduled time', data.timing.scheduledTime)}
                      {field('Recorded elapsed (s)', data.timing.maxRecordedElapsedSeconds)}
                    </View>
                  </View>
                  {scoreTable('MATCH SCORE')}
                  {detailed ? (
                    <View style={styles.setColumns}>
                      {detailed.sets.map(set => (
                        <View key={set.number} nativeID={`${documentId}-set-${set.number}`} style={styles.setColumn}>
                          {section(`SET No. ${set.number}     ${set.score.player1Games}–${set.score.player2Games}`)}
                          <View style={styles.grid}>
                            <View {...keepTogether()} style={[styles.row, styles.shaded]}>
                              <Text style={[textStyle, styles.gridHeader, styles.gameNumber]}>Game</Text>
                              <Text style={[textStyle, styles.gridHeader, styles.server]}>Server</Text>
                              <Text style={[textStyle, styles.gridHeader, styles.side]}>Side</Text>
                              <View style={[styles.row, styles.pointGrid]}>
                                {field('Format', data.matchType === 'DOUBLES' ? 'Doubles' : 'Singles')}
                                {field('Tie-break', set.score.wasTiebreak ? 'Yes' : '—')}
                                {field('Doubles receivers', null)}{field('Time started', null)}
                              </View>
                              <Text style={[textStyle, styles.gridHeader, styles.gameResult]}>Games / {data.matchType === 'DOUBLES' ? 'Winning Team' : 'Winner'}</Text>
                              <Text style={[textStyle, styles.gridHeader, styles.ballColumn]}>Ball change</Text>
                            </View>
                            {Array.from({ length: Math.max(16, ...set.games.map(game => game.number)) }, (_, index) => {
                              const game = set.games.find(game => game.number === index + 1);
                              return <View key={index} {...keepTogether()} style={[styles.gameRow, !game && styles.emptyGameRow, index % 2 === 1 && styles.shaded]}>
                                <Text style={[textStyle, styles.gridHeader, styles.gameNumber, styles.bold]}>{index + 1}</Text>
                                <Text style={[textStyle, styles.gridHeader, styles.server]}>{game ? playerName(game.server) : ''}</Text>
                                <Text style={[textStyle, styles.gridHeader, styles.side]}>{game ? '—' : ''}</Text>
                                <View style={styles.pointGrid}>
                                  {!game ? null : game.isTiebreak ? <Text style={[textStyle, styles.tieRow]}>TIE-BREAK</Text>
                                    : Array.from({ length: 12 }, (_, pointIndex) => pointCell(game?.points[pointIndex], pointIndex))}
                                </View>
                                <Text style={[textStyle, styles.gridHeader, styles.gameResult]}>{game ? winnerCode(game.winner) : ''}</Text>
                                <View style={styles.ballColumn}><View style={styles.ballMarker} accessibilityLabel="Ball change not recorded" /></View>
                              </View>;
                            })}
                          </View>
                          {set.games.some(game => game.isTiebreak) && <>
                          {section('TIE-BREAK')}
                          <View style={styles.box}>
                            {set.games.filter(game => game.isTiebreak).map(game => (
                              <View key={game.number}>
                                <View {...keepTogether()} style={styles.row}>
                                  {field('Game', game.number)}{field('Opening server', playerName(game.server))}
                                  {field('Score', `${set.score.tiebreakPlayer1Points ?? '—'}–${set.score.tiebreakPlayer2Points ?? '—'}`)}
                                </View>
                                <View style={styles.extraPoints}>{game.points.map((point, index) => pointCell(point, index, true))}</View>
                              </View>
                            ))}
                          </View>
                          </>}
                          {set.games.some(game => !game.isTiebreak && game.points.length > 12) && <>
                          {section('EXTENDED GAMES')}
                          <View style={styles.box}>
                            <View {...keepTogether()} style={[styles.row, styles.shaded]}>
                              <Text style={[textStyle, styles.gridHeader, styles.server]}>Server</Text>
                              <Text style={[textStyle, styles.gridHeader, styles.gameNumber]}>Game</Text>
                              <Text style={[textStyle, styles.tableCell, styles.grow]}>Additional advantage points</Text>
                            </View>
                            {set.games.filter(game => !game.isTiebreak && game.points.length > 12).map(game => (
                              <View key={game.number} style={styles.row}>
                                <Text style={[textStyle, styles.gridHeader, styles.server]}>{playerName(game.server)}</Text>
                                <Text style={[textStyle, styles.gridHeader, styles.gameNumber]}>{game.number}</Text>
                                <View style={[styles.extraPoints, styles.grow]}>{game.points.slice(12).map((point, index) => pointCell(point, index))}</View>
                              </View>
                            ))}
                          </View>
                          </>}
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={[styles.box, styles.notes]}>
                      <Text style={textStyle}>
                        {recording.status === 'UNAVAILABLE' ||
                        recording.status === 'INCONSISTENT'
                          ? recording.reason
                          : ''}
                      </Text>
                    </View>
                  )}
                  {section('CHAIR UMPIRE')}
                  <View style={[styles.box, styles.row]}>
                    {field('Signature', data.signatures, 3)}
                    {field('Certification', 'NON-CERTIFIED')}
                  </View>
                  <Text nativeID={`${documentId}-content-end`} style={[textStyle, styles.footer]}
                    accessibilityLabel={recording.status === 'PARTIAL' ? recording.limitations.join(' ') : undefined}>
                    Tennis Scorecard
                  </Text>
                </View>
              </View>
            </ScrollView>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/** Web-only export of the mounted document: no duplicate layout or score calculations. */
async function downloadScoreSheetPdf(element: HTMLElement, fileName: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    // Expo also bundles routes for Node; explicitly use the browser build for this web-only action.
    // @ts-expect-error jsPDF publishes declarations for the package root, not its browser subpath.
    import('jspdf/dist/jspdf.es.min.js') as Promise<typeof import('jspdf')>,
  ]);
  await document.fonts.ready;
  const bounds = element.getBoundingClientRect();
  const width = Math.ceil(bounds.width);
  const height = Math.ceil(Math.max(bounds.height, element.scrollHeight));
  const contentEnd = element.querySelector(`[id="${element.id}-content-end"]`);
  const contentBottom = contentEnd
    ? Math.ceil(contentEnd.getBoundingClientRect().bottom - bounds.top)
    : height;
  if (width <= 0 || height <= 0 || !element.isConnected) throw new Error('Score sheet is not visible');

  // A3 landscape keeps the fixed-width scorecard legible without shrinking its full height.
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3', compress: true });
  const margin = 8;
  const printableWidth = pdf.internal.pageSize.getWidth() - margin * 2;
  const printableHeight = pdf.internal.pageSize.getHeight() - margin * 2 - 5;
  const pageHeight = Math.floor(width * printableHeight / printableWidth);
  const range = (node: Element) => {
    const rect = node.getBoundingClientRect();
    return { top: rect.top - bounds.top, bottom: rect.bottom - bounds.top };
  };
  const keepRanges = Array.from(element.querySelectorAll(`[id^="${element.id}-keep-"]`), range);
  for (const heading of Array.from(element.querySelectorAll(`[id^="${element.id}-heading-"]`))) {
    const next = heading.nextElementSibling;
    // Keep a heading with its table header and first row, not an entire tall table.
    const firstRow = next?.firstElementChild;
    const headingEnd = firstRow?.nextElementSibling ?? firstRow ?? next;
    if (headingEnd) keepRanges.push({ top: range(heading).top, bottom: range(headingEnd).bottom });
  }
  let top = 0;
  let page = 0;
  let lastContentPage = 0;
  // Keep existing content-page captures intact, but do not start another page
  // for the outer wrapper's bottom padding/border after the final document text.
  while (top < height && top < contentBottom) {
    let bottom = Math.min(height, top + pageHeight);
    // Move breaks above rows/cells that fit a page. Oversized rows may continue,
    // but their individual point cells still supply safe break boundaries.
    let previousBottom;
    do {
      previousBottom = bottom;
      for (const block of keepRanges) {
        if (block.top > top + 1 && block.top < bottom && block.bottom > bottom + 0.5 &&
            block.bottom - block.top <= pageHeight) bottom = Math.min(bottom, Math.floor(block.top));
      }
    } while (bottom < previousBottom);
    if (bottom <= top) throw new Error('Cannot paginate score sheet');

    // Capture one page at a time to avoid browser maximum-canvas-height limits.
    // Only the cloned document is detached from the modal's scroll/overflow wrappers.
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff', scale: 2, logging: false,
      width, height: bottom - top, x: 0, y: top,
      windowWidth: Math.max(width, document.documentElement.clientWidth),
      scrollX: 0, scrollY: 0,
      onclone: (clonedDocument, clonedElement) => {
        clonedDocument.body.replaceChildren(clonedElement);
        clonedDocument.body.style.cssText = 'margin:0;padding:0;overflow:visible;background:white;';
        Object.assign(clonedElement.style, {
          position: 'absolute', left: '0', top: '0', margin: '0',
          width: `${width}px`, height: 'auto', maxHeight: 'none', overflow: 'visible',
        });
      },
    });
    try {
      // The measured scroll container can extend beyond its rendered content.
      // Count only pages with visible pixels before adding the PDF page footer.
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Cannot inspect score sheet page');
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] !== 0 &&
            (pixels[index] !== 255 || pixels[index + 1] !== 255 || pixels[index + 2] !== 255)) {
          lastContentPage = page + 1;
          break;
        }
      }
      if (page > 0) pdf.addPage('a3', 'landscape');
      pdf.addImage(canvas, 'PNG', margin, margin, printableWidth,
        (bottom - top) * printableWidth / width, undefined, 'FAST');
    } finally {
      canvas.width = 0;
      canvas.height = 0;
    }
    page++;
    top = bottom;
  }
  if (lastContentPage === 0) throw new Error('Score sheet rendered empty');
  while (page > lastContentPage) {
    pdf.deletePage(page);
    page--;
  }
  for (let pageNumber = 1; pageNumber <= page; pageNumber++) {
    pdf.setPage(pageNumber);
    pdf.setFontSize(8);
    pdf.setTextColor(90);
    pdf.text('Tennis Scorecard', margin, pdf.internal.pageSize.getHeight() - 5);
    pdf.text(`Page ${pageNumber} / ${page}`, pdf.internal.pageSize.getWidth() - margin,
      pdf.internal.pageSize.getHeight() - 5, { align: 'right' });
  }
  // A download link keeps the current route, modal and browser fullscreen state intact.
  const url = URL.createObjectURL(pdf.output('blob'));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  panel: {
    width: '100%',
    maxWidth: 1260,
    height: '94%',
    backgroundColor: '#e5e5e5',
    borderWidth: 1,
    borderColor: '#444',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#444',
  },
  actions: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  viewport: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  documentStrip: { flexGrow: 1, justifyContent: 'center', padding: 12 },
  document: { width: 1200, gap: 20 },
  page: {
    width: 1200,
    minHeight: 0,
    padding: 28,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  text: {
    color: '#111',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '400',
    letterSpacing: 0,
  },
  title: { fontSize: 20, lineHeight: 25, fontWeight: '700', letterSpacing: 1 },
  bold: { fontWeight: '700' },
  label: { fontSize: 10, lineHeight: 13 },
  section: { fontWeight: '700', fontSize: 12, marginTop: 8, marginBottom: 3 },
  box: { borderWidth: 1.5, borderColor: '#222' },
  row: { flexDirection: 'row' },
  field: {
    minWidth: 0,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 1,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#555',
  },
  matchRow: { gap: 4 },
  grow: { flex: 1 },
  versus: { textAlign: 'center', fontWeight: '700', paddingVertical: 3 },
  scoreName: {
    flex: 1,
    padding: 6,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#555',
  },
  scoreCell: {
    width: 80,
    padding: 6,
    textAlign: 'center',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#555',
  },
  shaded: { backgroundColor: '#f0f0f0' },
  notes: { padding: 8, gap: 3 },
  footer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#555',
    textAlign: 'right',
    fontSize: 10,
  },
  legend: { marginVertical: 6, fontSize: 10, lineHeight: 14 },
  setColumns: { gap: 8 },
  setColumn: { width: 1140 },
  grid: { borderWidth: 1.5, borderColor: '#222' },
  gridHeader: {
    padding: 3,
    fontSize: 9,
    lineHeight: 12,
    borderRightWidth: 0.5,
    borderColor: '#555',
    textAlign: 'center',
  },
  gameNumber: { width: 32 },
  server: { width: 90 },
  side: { width: 30 },
  pointsHeading: { width: 768 },
  gameResult: { width: 140 },
  emptyGameRow: { minHeight: 20 },
  gameRow: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#444' },
  pointGrid: {
    width: 768,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  pointCell: {
    width: 64,
    padding: 3,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#777',
    minHeight: 36,
  },
  pointText: { fontSize: 11, lineHeight: 14, textAlign: 'center' },
  pointIndicator: { fontSize: 8, lineHeight: 10, textAlign: 'center' },
  playerColumn: { flex: 1 },
  countryColumn: { width: 160 },
  choiceColumn: { width: 100 },
  tableCell: { padding: 5, borderRightWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#555' },
  ballColumn: { width: 77, alignItems: 'center', justifyContent: 'center' },
  ballMarker: { width: 18, height: 18, borderRadius: 9, borderWidth: 0.7, borderColor: '#444' },
  extraPoints: { flexDirection: 'row', flexWrap: 'wrap' },
  tieRow: { width: 768, textAlign: 'center', padding: 8 },
});
