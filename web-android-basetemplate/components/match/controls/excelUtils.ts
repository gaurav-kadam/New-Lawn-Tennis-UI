import XLSX from 'xlsx-js-style';
import { Platform, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface LogEntry {
  time: string;
  player: string;
  team: string;
  type: string;
  score: string;
  quarter: number;
}

export interface PlayerEntry {
  cap_no: number | null;
  first_name: string;
  last_name: string;
}

export interface MatchOfficials {
  referee1?: string;
  referee2?: string;
  timekeeper1?: string;
  timekeeper2?: string;
  goalJudge1?: string;
  goalJudge2?: string;
  digitalScorer?: string;
}

export interface MatchMeta {
  matchDate?: string;
  matchNo?: string | number;
  gender?: string;
  venue?: string;
  quarterScores?: {
    white: [number, number, number, number];
    blue: [number, number, number, number];
  };
  whiteCoach?: string;
  blueCoach?: string;
  matchOfficials?: MatchOfficials;
}

// ─── Style constants ──────────────────────────────────────────────────────────

const BLK         = '000000';
const GRAY_TITLE  = 'BFBFBF';
const GRAY_HDR    = 'D9D9D9';

const thin   = { style: 'thin',   color: { rgb: BLK } };
const medium = { style: 'medium', color: { rgb: BLK } };

const THIN_ALL: any = { top: thin, bottom: thin, left: thin, right: thin };
const MED_ALL: any  = { top: medium, bottom: medium, left: medium, right: medium };

// ── Named cell-style objects ──────────────────────────────────────────────────

const sTitle: any = {
  font: { bold: true, sz: 14, name: 'Arial' },
  alignment: { horizontal: 'center', vertical: 'center' },
  fill: { fgColor: { rgb: GRAY_TITLE }, patternType: 'solid' },
  border: MED_ALL,
};

const sSecHdr: any = {
  font: { bold: true, sz: 10, name: 'Arial' },
  alignment: { horizontal: 'center', vertical: 'center' },
  fill: { fgColor: { rgb: GRAY_HDR }, patternType: 'solid' },
  border: THIN_ALL,
};

const sColHdr: any = {
  font: { bold: true, sz: 9, name: 'Arial' },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  fill: { fgColor: { rgb: GRAY_HDR }, patternType: 'solid' },
  border: THIN_ALL,
};

const sLabel: any = {
  font: { sz: 9, name: 'Arial' },
  alignment: { horizontal: 'left', vertical: 'center' },
  border: THIN_ALL,
};

const sBoldLabel: any = {
  font: { bold: true, sz: 9, name: 'Arial' },
  alignment: { horizontal: 'left', vertical: 'center' },
  border: THIN_ALL,
};

const sData: any = {
  font: { sz: 9, name: 'Arial' },
  alignment: { horizontal: 'left', vertical: 'center' },
  border: THIN_ALL,
};

const sDataCtr: any = {
  font: { sz: 9, name: 'Arial' },
  alignment: { horizontal: 'center', vertical: 'center' },
  border: THIN_ALL,
};

const sTotalLabel: any = {
  font: { bold: true, sz: 9, name: 'Arial' },
  alignment: { horizontal: 'left', vertical: 'center' },
  border: THIN_ALL,
};

const sTotalData: any = {
  font: { bold: true, sz: 9, name: 'Arial' },
  alignment: { horizontal: 'center', vertical: 'center' },
  border: THIN_ALL,
};

const sSmall: any = {
  font: { sz: 8, name: 'Arial' },
  alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
  border: THIN_ALL,
};

const sEmpty: any = {
  border: THIN_ALL,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function s(ws: any, addr: string, v: string | number, styles?: any) {
  ws[addr] = {
    v,
    t: typeof v === 'number' ? 'n' : 's',
    s: styles || {},
  };
}

function sc(ws: any, r: number, c: number, v: string | number, styles?: any) {
  s(ws, XLSX.utils.encode_cell({ r, c }), v, styles);
}

function merge(ws: any, ref: string) {
  if (!ws['!merges']) ws['!merges'] = [];
  ws['!merges'].push(XLSX.utils.decode_range(ref));
}

// Fill a rectangular range with bordered empty cells for grid lines.
// Only writes to cells that don't yet have content so data cells always win.
function fillRange(ws: any, r1: number, c1: number, r2: number, c2: number, style: any = sEmpty) {
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      if (!ws[addr]) {
        ws[addr] = { v: '', t: 's', s: style };
      }
    }
  }
}

// ─── Main workbook builder ────────────────────────────────────────────────────

export function generateMatchWorkbook(
  logs: LogEntry[] = [],
  whitePlayers: PlayerEntry[] = [],
  bluePlayers: PlayerEntry[] = [],
  whiteTeamName = '',
  blueTeamName = '',
  meta: MatchMeta = {}
): any {
  const wb = XLSX.utils.book_new();
  const ws: any = {};

  // Worksheet range covers A1:AF39 (32 cols × 39 rows)
  // Column layout: White roster A–K (11 cols, incl. new "Total Penalty Goals"),
  // Timeline L–U (10 cols), Blue roster V–AF (11 cols, incl. new "Total Penalty Goals").
  ws['!ref'] = 'A1:AF39';

  // ── Column widths (A–AF, 32 columns) ──────────────────────────────────────────
  ws['!cols'] = [
    { wch: 5 },  { wch: 20 }, { wch: 4 },  { wch: 4 },  { wch: 4 },   // A–E
    { wch: 5 },  { wch: 5 },  { wch: 5 },  { wch: 5 },  { wch: 6 },   // F–J
    { wch: 7 },                                                       // K   (Total Penalty Goals, white)
    { wch: 7 },  { wch: 8 },  { wch: 8 },  { wch: 14 }, { wch: 6 },   // L–P
    { wch: 7 },  { wch: 8 },  { wch: 8 },  { wch: 14 }, { wch: 6 },   // Q–U
    { wch: 5 },  { wch: 20 }, { wch: 4 },  { wch: 4 },  { wch: 4 },   // V–Z
    { wch: 5 },  { wch: 5 },  { wch: 5 },  { wch: 5 },  { wch: 6 },   // AA–AE
    { wch: 7 },                                                       // AF  (Total Penalty Goals, blue)
  ];

  // ── Row heights ───────────────────────────────────────────────────────────────
  ws['!rows'] = [
    { hpt: 30 }, // Row 1  – title
    { hpt: 18 }, // Row 2  – section sub-labels
    { hpt: 18 }, // Row 3  – timeline column headers
    { hpt: 15 }, // Row 4
    { hpt: 15 }, // Row 5
    { hpt: 15 }, // Row 6
    { hpt: 15 }, // Row 7
    { hpt: 15 }, // Row 8
    { hpt: 15 }, // Row 9
    { hpt: 15 }, // Row 10
    { hpt: 15 }, // Row 11 – spacer
    { hpt: 15 }, // Row 12 – team names
    { hpt: 15 }, // Row 13 – spacer
    { hpt: 15 }, // Row 14 – cap colours
    { hpt: 15 }, // Row 15 – spacer
    { hpt: 15 }, // Row 16 – coaches
    { hpt: 15 }, // Row 17 – spacer
    { hpt: 18 }, // Row 18 – roster group headers
    { hpt: 18 }, // Row 19 – roster quarter sub-labels
    ...Array(14).fill({ hpt: 16 }), // Rows 20–33 – player rows
    { hpt: 16 }, // Row 34 – TOTAL
    { hpt: 8  }, // Row 35 – spacer
    { hpt: 18 }, // Row 36 – bottom section headers
    { hpt: 18 }, // Row 37 – bottom sub-headers
    { hpt: 16 }, // Row 38
    { hpt: 16 }, // Row 39
  ];

  // ── Pre-fill grid areas with empty bordered cells ─────────────────────────────
  // White roster table: rows 18–34 (r:17–33), cols A–K (c:0–10)
  fillRange(ws, 17, 0, 33, 10);
  // Blue roster table: rows 18–34 (r:17–33), cols V–AF (c:21–31)
  fillRange(ws, 17, 21, 33, 31);
  // Timeline area: rows 3–34 (r:2–33), cols L–U (c:11–20)
  fillRange(ws, 2, 11, 33, 20);
  // Bottom RESULT block: rows 36–39 (r:35–38), cols B–G (c:1–6)
  fillRange(ws, 35, 1, 38, 6);
  // Bottom TIME OUT (left): rows 36–39 (r:35–38), cols I–L (c:8–11)
  fillRange(ws, 35, 8, 38, 11);
  // Bottom ABBREVIATIONS: rows 36–39 (r:35–38), cols O–T (c:14–19)
  fillRange(ws, 35, 14, 38, 19);
  // Bottom TIME OUT (right): rows 36–39 (r:35–38), cols X–AA (c:23–26)
  fillRange(ws, 35, 23, 38, 26);
  // Bottom CONFIRMATION: rows 36–39 (r:35–38), cols AB–AF (c:27–31)
  fillRange(ws, 35, 27, 38, 31);

  // ── Row 1: Title ──────────────────────────────────────────────────────────────
  s(ws, 'A1', 'WATER POLO SCORESHEET', sTitle);
  merge(ws, 'A1:AF1');

  // ── Row 2: Section sub-labels ─────────────────────────────────────────────────
  s(ws, 'L2', 'Waterpolo Score Sheet', sSecHdr);
  merge(ws, 'L2:U2');
  s(ws, 'V2', 'OFFICIALS', sSecHdr);
  merge(ws, 'V2:AF2');

  // ── Row 3: Timeline column headers (L3:U3, cols 11–20) ───────────────────────
  ['Time', 'Player', 'Colour', 'Comment', 'Score',
   'Time', 'Player', 'Colour', 'Comment', 'Score'].forEach((h, i) => {
    sc(ws, 2, 11 + i, h, sColHdr);
  });

  // ── Rows 4–10: Left metadata + Officials ──────────────────────────────────────
  const {
    matchDate = '', matchNo = '', gender = '', venue = '', quarterScores,
    whiteCoach = '', blueCoach = '', matchOfficials = {},
  } = meta;
  const {
    referee1 = '', referee2 = '', timekeeper1 = '', timekeeper2 = '',
    goalJudge1 = '', goalJudge2 = '', digitalScorer = '',
  } = matchOfficials;

  s(ws, 'A4',  `VENUE : ${venue}`,           sLabel); merge(ws, 'A4:J4');
  s(ws, 'A6',  `MATCH DATE : ${matchDate}`,  sLabel); merge(ws, 'A6:J6');
  s(ws, 'A8',  `MATCH NO. : ${matchNo}`,     sLabel); merge(ws, 'A8:J8');
  s(ws, 'A10', `GENDER : ${gender}`,         sLabel); merge(ws, 'A10:J10');

  s(ws, 'V4',  `REFEREE 1      : ${referee1}`,      sLabel); merge(ws, 'V4:AF4');
  s(ws, 'V5',  `REFEREE 2      : ${referee2}`,      sLabel); merge(ws, 'V5:AF5');
  s(ws, 'V6',  `TIMEKEEPER 1   : ${timekeeper1}`,   sLabel); merge(ws, 'V6:AF6');
  s(ws, 'V7',  `TIMEKEEPER 2   : ${timekeeper2}`,   sLabel); merge(ws, 'V7:AF7');
  s(ws, 'V8',  `GOAL JUDGE 1   : ${goalJudge1}`,    sLabel); merge(ws, 'V8:AF8');
  s(ws, 'V9',  `GOAL JUDGE 2   : ${goalJudge2}`,    sLabel); merge(ws, 'V9:AF9');
  s(ws, 'V10', `DIGITAL SCORER : ${digitalScorer}`, sLabel); merge(ws, 'V10:AF10');

  // ── Rows 12 / 14 / 16: Team info ──────────────────────────────────────────────
  s(ws, 'A12', `TEAM : ${whiteTeamName}`, sBoldLabel);
  s(ws, 'V12', `TEAM : ${blueTeamName}`,  sBoldLabel);
  s(ws, 'A14', 'CAP COLOUR : WHITE',      sBoldLabel);
  s(ws, 'V14', 'CAP COLOUR : BLUE',       sBoldLabel);
  s(ws, 'A16', `COACH : ${whiteCoach}`,   sLabel); merge(ws, 'C16:K16');
  s(ws, 'V16', `COACH : ${blueCoach}`,    sLabel); merge(ws, 'X16:AF16');

  // ── Rows 18–19: Roster column group headers ───────────────────────────────────
  s(ws, 'A18',  'No.',                  sColHdr); merge(ws, 'A18:A19');
  s(ws, 'B18',  'Player',               sColHdr); merge(ws, 'B18:B19');
  s(ws, 'C18',  'Major Fouls',          sColHdr); merge(ws, 'C18:E18');
  s(ws, 'F18',  'Goals by Qtr',         sColHdr); merge(ws, 'F18:I18');
  s(ws, 'J18',  'Total',                sColHdr); merge(ws, 'J18:J19');
  s(ws, 'K18',  'Total Penalty Goals',  sColHdr); merge(ws, 'K18:K19');

  s(ws, 'V18',  'No.',                  sColHdr); merge(ws, 'V18:V19');
  s(ws, 'W18',  'Player',               sColHdr); merge(ws, 'W18:W19');
  s(ws, 'X18',  'Major Fouls',          sColHdr); merge(ws, 'X18:Z18');
  s(ws, 'AA18', 'Goals by Qtr',         sColHdr); merge(ws, 'AA18:AD18');
  s(ws, 'AE18', 'Total',                sColHdr); merge(ws, 'AE18:AE19');
  s(ws, 'AF18', 'Total Penalty Goals',  sColHdr); merge(ws, 'AF18:AF19');

  // Row 19: Quarter sub-labels (r:18 = row 19)
  [1, 2, 3].forEach((n, i)    => sc(ws, 18, 2  + i, n, sColHdr)); // C19, D19, E19
  [1, 2, 3, 4].forEach((n, i) => sc(ws, 18, 5  + i, n, sColHdr)); // F19, G19, H19, I19
  [1, 2, 3].forEach((n, i)    => sc(ws, 18, 23 + i, n, sColHdr)); // X19, Y19, Z19
  [1, 2, 3, 4].forEach((n, i) => sc(ws, 18, 26 + i, n, sColHdr)); // AA19, AB19, AC19, AD19

  // ── Rows 20–33: Cap numbers & player names ────────────────────────────────────
  const sortedWhite = [...whitePlayers].sort((a, b) => (a.cap_no ?? 99) - (b.cap_no ?? 99));
  const sortedBlue  = [...bluePlayers].sort((a, b)  => (a.cap_no ?? 99) - (b.cap_no ?? 99));

  for (let cap = 1; cap <= 14; cap++) {
    const r = 19 + cap - 1; // Excel rows 20-33 → SheetJS r:19–32
    sc(ws, r, 0,  cap, sDataCtr); // Col A
    sc(ws, r, 21, cap, sDataCtr); // Col V
  }

  sortedWhite.slice(0, 14).forEach((p, i) => {
    sc(ws, 19 + i, 1,  `${p.first_name} ${p.last_name}`.trim(), sData); // Col B
  });
  sortedBlue.slice(0, 14).forEach((p, i) => {
    sc(ws, 19 + i, 22, `${p.first_name} ${p.last_name}`.trim(), sData); // Col W
  });

  // ── Per-player stats helpers ──────────────────────────────────────────────────
  const playerLogs = (capNo: number | null, team: 'White' | 'Blue') => {
    if (capNo === null) return [];
    const capStr = String(capNo);
    return logs.filter(l => l.team === team && l.player === capStr);
  };

  // Goals scored during regulation play (quarters 1–4), including in-game penalty
  // goal conversions — shown per-quarter next to the player, same as any other
  // goal type. Shootout penalty goals carry quarter 5 and never match q in 1..4,
  // so they can never leak into quarters 1–4 here.
  const quarterGoalCount = (capNo: number | null, team: 'White' | 'Blue', q: number) =>
    playerLogs(capNo, team).filter(l =>
      l.quarter === q && l.type.includes('Goal') && l.type !== 'Self Goal'
    ).length;

  // Penalty-shootout goals only (post-4th-quarter, quarter === 5). Tracked in a
  // dedicated column, separate from the regulation Total column.
  const totalPenaltyGoalCount = (capNo: number | null, team: 'White' | 'Blue') =>
    playerLogs(capNo, team).filter(l => l.type === 'Penalty Goal' && l.quarter === 5).length;

  const exclusionList = (capNo: number | null, team: 'White' | 'Blue') =>
    playerLogs(capNo, team).filter(l => l.type === 'Exclusion Foul');

  // ── Rows 20–33: White stats ───────────────────────────────────────────────────
  // Major Fouls → C/D/E (c:2/3/4)  Goals by Qtr → F/G/H/I (c:5/6/7/8)
  // Total → J (c:9)  Total Penalty Goals → K (c:10)
  let whiteTotalSum = 0;
  let whitePenaltyTotalSum = 0;
  sortedWhite.slice(0, 14).forEach((p, i) => {
    const r = 19 + i;
    exclusionList(p.cap_no, 'White').slice(0, 3).forEach((_, ei) => {
      sc(ws, r, 2 + ei, 'X', sDataCtr);
    });
    let qTotal = 0;
    for (let q = 1; q <= 4; q++) {
      const cnt = quarterGoalCount(p.cap_no, 'White', q);
      if (cnt > 0) sc(ws, r, 4 + q, cnt, sDataCtr); // q=1→c:5=F, etc.
      qTotal += cnt;
    }
    if (qTotal > 0) sc(ws, r, 9, qTotal, sDataCtr); // Col J
    whiteTotalSum += qTotal;
    const shootoutPG = totalPenaltyGoalCount(p.cap_no, 'White');
    if (shootoutPG > 0) sc(ws, r, 10, shootoutPG, sDataCtr); // Col K
    whitePenaltyTotalSum += shootoutPG;
  });

  // ── Rows 20–33: Blue stats ────────────────────────────────────────────────────
  // Major Fouls → X/Y/Z (c:23/24/25)  Goals by Qtr → AA/AB/AC/AD (c:26/27/28/29)
  // Total → AE (c:30)  Total Penalty Goals → AF (c:31)
  let blueTotalSum = 0;
  let bluePenaltyTotalSum = 0;
  sortedBlue.slice(0, 14).forEach((p, i) => {
    const r = 19 + i;
    exclusionList(p.cap_no, 'Blue').slice(0, 3).forEach((_, ei) => {
      sc(ws, r, 23 + ei, 'X', sDataCtr);
    });
    let qTotal = 0;
    for (let q = 1; q <= 4; q++) {
      const cnt = quarterGoalCount(p.cap_no, 'Blue', q);
      if (cnt > 0) sc(ws, r, 25 + q, cnt, sDataCtr); // q=1→c:26=AA, etc.
      qTotal += cnt;
    }
    if (qTotal > 0) sc(ws, r, 30, qTotal, sDataCtr); // Col AE
    blueTotalSum += qTotal;
    const shootoutPG = totalPenaltyGoalCount(p.cap_no, 'Blue');
    if (shootoutPG > 0) sc(ws, r, 31, shootoutPG, sDataCtr); // Col AF
    bluePenaltyTotalSum += shootoutPG;
  });

  // ── Row 34: Totals label ──────────────────────────────────────────────────────
  s(ws, 'A34', 'TOTAL', sTotalLabel);
  s(ws, 'V34', 'TOTAL', sTotalLabel);

  // Row 34: vertical sums for Total (J/AE) and Total Penalty Goals (K/AF) columns only
  s(ws, 'J34',  whiteTotalSum,        sTotalData);
  s(ws, 'K34',  whitePenaltyTotalSum, sTotalData);
  s(ws, 'AE34', blueTotalSum,         sTotalData);
  s(ws, 'AF34', bluePenaltyTotalSum,  sTotalData);

  // ── Logs block: L–P (cols 11–15) then Q–U (cols 16–20), rows 4–34 ───────────
  const LOG_START = 4;
  const SLOTS = 31; // rows 4–34

  logs.forEach((log, idx) => {
    if (idx >= SLOTS * 2) return;
    const block    = Math.floor(idx / SLOTS);
    const r        = LOG_START - 1 + (idx % SLOTS); // SheetJS 0-indexed row
    const startCol = block === 0 ? 11 : 16;          // L=c:11, Q=c:16

    sc(ws, r, startCol,     log.time,   sDataCtr);
    sc(ws, r, startCol + 1, log.player, sDataCtr);
    sc(ws, r, startCol + 2, log.team,   sDataCtr);
    sc(ws, r, startCol + 3, log.type,   sData);
    sc(ws, r, startCol + 4, log.score,  sDataCtr);
  });

  // ── Row 36: Section headers ───────────────────────────────────────────────────
  s(ws, 'B36',  'RESULT',        sSecHdr); merge(ws, 'B36:G36');
  s(ws, 'I36',  'TIME OUT',      sSecHdr); merge(ws, 'I36:L36');
  s(ws, 'O36',  'ABBREVIATIONS', sSecHdr); merge(ws, 'O36:T36');
  s(ws, 'X36',  'TIME OUT',      sSecHdr); merge(ws, 'X36:AA36');
  s(ws, 'AB36', 'CONFIRMATION',  sSecHdr); merge(ws, 'AB36:AF36');

  // ── Row 37: Sub-headers (r:36 = row 37) ──────────────────────────────────────
  s(ws, 'B37', 'TEAM', sColHdr);
  [1, 2, 3, 4].forEach((n, i) => sc(ws, 36, 2  + i, n, sColHdr)); // C37–F37
  s(ws, 'G37', 'Total', sColHdr);
  [1, 2, 3, 4].forEach((n, i) => sc(ws, 36, 8  + i, n, sColHdr)); // I37–L37
  s(ws, 'O37', 'G - Goal           P - Penalty           E - Exclusion Foul           S - Suspension', sSmall);
  merge(ws, 'O37:T37');
  [1, 2, 3, 4].forEach((n, i) => sc(ws, 36, 23 + i, n, sColHdr)); // X37–AA37
  s(ws, 'AB37', 'Referee : _____________________', sData);
  merge(ws, 'AB37:AF37');

  // ── Rows 38–39: Quarter score summary ────────────────────────────────────────
  const wq = quarterScores?.white ?? [0, 0, 0, 0];
  const bq = quarterScores?.blue  ?? [0, 0, 0, 0];
  const wTotal = wq.reduce((acc, v) => acc + v, 0);
  const bTotal = bq.reduce((acc, v) => acc + v, 0);

  s(ws, 'B38', whiteTeamName || 'White', sData);
  s(ws, 'C38', wq[0], sDataCtr); s(ws, 'D38', wq[1], sDataCtr);
  s(ws, 'E38', wq[2], sDataCtr); s(ws, 'F38', wq[3], sDataCtr);
  s(ws, 'G38', wTotal, sDataCtr);
  s(ws, 'B39', blueTeamName || 'Blue', sData);
  s(ws, 'C39', bq[0], sDataCtr); s(ws, 'D39', bq[1], sDataCtr);
  s(ws, 'E39', bq[2], sDataCtr); s(ws, 'F39', bq[3], sDataCtr);
  s(ws, 'G39', bTotal, sDataCtr);

  s(ws, 'O38', 'TO - Time Out           PG - Penalty Goal           EG - Extra Man Goal', sSmall);
  merge(ws, 'O38:T38');
  s(ws, 'AB38', '________________________________', sData);
  merge(ws, 'AB38:AF38');

  XLSX.utils.book_append_sheet(wb, ws, 'Official Match Record Sheet');
  return wb;
}

// ─── Cross-platform save ──────────────────────────────────────────────────────

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export async function saveWorkbook(wb: any, filename: string): Promise<void> {
  if (Platform.OS === 'web') {
    XLSX.writeFile(wb, filename);
    return;
  }

  // Native (Android / iOS): write base64 to document directory then share
  const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' }) as string;
  const dir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? '';
  const fileUri = dir + filename;

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(fileUri, {
      mimeType: XLSX_MIME,
      dialogTitle: 'Share Match Scoresheet',
      UTI: 'com.microsoft.excel.xlsx',
    });
  } else {
    Alert.alert('Export Successful', 'File saved to your documents folder.');
  }
}
