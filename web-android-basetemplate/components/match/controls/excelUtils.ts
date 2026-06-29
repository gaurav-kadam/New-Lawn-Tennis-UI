import * as ExcelJS from 'exceljs';

const thin: Partial<ExcelJS.Border> = { style: 'thin' };
const allBorders: Partial<ExcelJS.Borders> = { top: thin, left: thin, bottom: thin, right: thin };

function applyBorders(
  sheet: ExcelJS.Worksheet,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
) {
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      sheet.getCell(r, c).border = allBorders;
    }
  }
}

function bold(sheet: ExcelJS.Worksheet, addr: string, value: string | number, size = 10) {
  const cell = sheet.getCell(addr);
  cell.value = value;
  cell.font = { bold: true, size };
  return cell;
}

function center(cell: ExcelJS.Cell) {
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  return cell;
}

export const generateMatchWorkbook = async (): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Official Match Record Sheet');

  // ── Column widths ──────────────────────────────────────────────────────────
  // A-J: White team  |  K-T: Timeline  |  U-AD: Blue team / Officials
  sheet.columns = [
    { width: 5 },  { width: 20 }, { width: 4 },  { width: 4 },  { width: 4 },   // A-E
    { width: 5 },  { width: 5 },  { width: 5 },  { width: 5 },  { width: 6 },   // F-J
    { width: 7 },  { width: 8 },  { width: 8 },  { width: 14 }, { width: 6 },   // K-O (timeline left)
    { width: 7 },  { width: 8 },  { width: 8 },  { width: 14 }, { width: 6 },   // P-T (timeline right)
    { width: 5 },  { width: 20 }, { width: 4 },  { width: 4 },  { width: 4 },   // U-Y
    { width: 5 },  { width: 5 },  { width: 5 },  { width: 5 },  { width: 6 },   // Z-AD
  ];

  // ── Row 1: Championship title ──────────────────────────────────────────────
  sheet.mergeCells('A1:AD1');
  const title = sheet.getCell('A1');
  title.value = 'WATER POLO SCORESHEET';
  title.font = { bold: true, size: 16 };
  title.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 30;

  // ── Row 2: Section sub-labels ──────────────────────────────────────────────
  sheet.mergeCells('K2:T2');
  center(bold(sheet, 'K2', 'Waterpolo Score Sheet', 11));
  sheet.mergeCells('U2:AD2');
  center(bold(sheet, 'U2', 'OFFICIALS', 11));

  // ── Row 3: Timeline column headers ────────────────────────────────────────
  const tlHeaders = ['Time', 'Player', 'Colour', 'Comment', 'Score',
                     'Time', 'Player', 'Colour', 'Comment', 'Score'];
  tlHeaders.forEach((h, i) => {
    const c = sheet.getCell(3, 11 + i); // K3:T3
    c.value = h;
    c.font = { bold: true, size: 9 };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // ── Rows 4–14: Left metadata + Officials right ────────────────────────────
  // Left side labels
  sheet.getCell('A4').value  = 'VENUE :';
  sheet.getCell('A6').value  = 'DATE  :';
  sheet.getCell('A8').value  = 'GAME NO. :';
  sheet.getCell('A10').value = 'GENDER :';

  // Officials right side
  sheet.getCell('U4').value  = 'REFEREES   :';
  sheet.getCell('U6').value  = 'SECRETARIES :';
  sheet.getCell('U8').value  = 'TIMEKEEPERS :';
  sheet.getCell('U10').value = 'GOAL JUDGES :';

  // ── Row 15: Team names ─────────────────────────────────────────────────────
  sheet.getCell('A15').value  = 'TEAM :';
  sheet.getCell('C15').value  = 'MEN / WOMEN';
  sheet.getCell('U15').value  = 'TEAM :';
  sheet.getCell('W15').value  = 'MEN / WOMEN';

  // ── Row 16: Cap colours ────────────────────────────────────────────────────
  sheet.getCell('A16').value = 'CAP COLOUR :';
  bold(sheet, 'C16', 'WHITE');
  sheet.getCell('U16').value = 'CAP COLOUR :';
  bold(sheet, 'W16', 'BLUE');

  // ── Row 17: Coach ──────────────────────────────────────────────────────────
  sheet.getCell('A17').value = 'COACH :';
  sheet.mergeCells('C17:J17');
  sheet.getCell('C17').value = '______________________________';
  sheet.getCell('U17').value = 'COACH :';
  sheet.mergeCells('W17:AD17');
  sheet.getCell('W17').value = '______________________________';

  // ── Row 18: Roster column group headers ────────────────────────────────────
  // White team
  sheet.mergeCells('A18:A19');
  center(bold(sheet, 'A18', 'No.', 9));

  sheet.mergeCells('B18:B19');
  center(bold(sheet, 'B18', 'Player', 9));

  sheet.mergeCells('C18:E18');
  center(bold(sheet, 'C18', 'Major Fouls', 9));

  sheet.mergeCells('F18:I18');
  center(bold(sheet, 'F18', 'Goals by Qtr', 9));

  sheet.mergeCells('J18:J19');
  center(bold(sheet, 'J18', 'Total', 9));

  // Blue team
  sheet.mergeCells('U18:U19');
  center(bold(sheet, 'U18', 'No.', 9));

  sheet.mergeCells('V18:V19');
  center(bold(sheet, 'V18', 'Player', 9));

  sheet.mergeCells('W18:Y18');
  center(bold(sheet, 'W18', 'Major Fouls', 9));

  sheet.mergeCells('Z18:AC18');
  center(bold(sheet, 'Z18', 'Goals by Qtr', 9));

  sheet.mergeCells('AD18:AD19');
  center(bold(sheet, 'AD18', 'Total', 9));

  // ── Row 19: Quarter sub-headers ────────────────────────────────────────────
  // White: C-E = Major Foul periods 1-3 | F-I = Goal quarters 1-4
  (['C', 'D', 'E'] as const).forEach((col, i) => center(Object.assign(sheet.getCell(`${col}19`), { value: i + 1 })));
  (['F', 'G', 'H', 'I'] as const).forEach((col, i) => center(Object.assign(sheet.getCell(`${col}19`), { value: i + 1 })));
  // Blue: W-Y = Major Foul periods 1-3 | Z-AC = Goal quarters 1-4
  (['W', 'X', 'Y'] as const).forEach((col, i) => center(Object.assign(sheet.getCell(`${col}19`), { value: i + 1 })));
  (['Z', 'AA', 'AB', 'AC'] as const).forEach((col, i) => center(Object.assign(sheet.getCell(`${col}19`), { value: i + 1 })));

  // ── Rows 20-33: Player roster caps 1–14 ───────────────────────────────────
  for (let cap = 1; cap <= 14; cap++) {
    const row = 19 + cap; // rows 20–33
    center(Object.assign(sheet.getCell(row, 1), { value: cap }));   // Col A (White)
    center(Object.assign(sheet.getCell(row, 21), { value: cap }));  // Col U (Blue)
  }

  // ── Row 34: TOTAL ──────────────────────────────────────────────────────────
  bold(sheet, 'A34', 'TOTAL');
  bold(sheet, 'U34', 'TOTAL');

  // ── Row 36: RESULT / TIME OUT / ABBREVIATIONS / TIME OUT / CONFIRMATION ───
  sheet.mergeCells('B36:G36');
  center(bold(sheet, 'B36', 'RESULT'));

  sheet.mergeCells('I36:L36');
  center(bold(sheet, 'I36', 'TIME OUT'));

  sheet.mergeCells('M36:V36');
  center(bold(sheet, 'M36', 'ABBREVIATIONS'));

  sheet.mergeCells('W36:Z36');
  center(bold(sheet, 'W36', 'TIME OUT'));

  sheet.mergeCells('AA36:AD36');
  center(bold(sheet, 'AA36', 'CONFIRMATION'));

  // ── Row 37: Sub-headers ────────────────────────────────────────────────────
  // Result
  center(Object.assign(sheet.getCell('B37'), { value: 'TEAM' }));
  (['C37', 'D37', 'E37', 'F37'] as const).forEach((a, i) => center(Object.assign(sheet.getCell(a), { value: i + 1 })));
  center(Object.assign(sheet.getCell('G37'), { value: 'Total' }));
  // Time Out 1
  (['I37', 'J37', 'K37', 'L37'] as const).forEach((a, i) => center(Object.assign(sheet.getCell(a), { value: i + 1 })));
  // Abbreviations line 1
  sheet.mergeCells('M37:V37');
  sheet.getCell('M37').value = 'G - Goal           P - Penalty           E - Exclusion Foul           S - Suspension';
  sheet.getCell('M37').font = { size: 9 };
  // Time Out 2
  (['W37', 'X37', 'Y37', 'Z37'] as const).forEach((a, i) => center(Object.assign(sheet.getCell(a), { value: i + 1 })));
  // Confirmation
  sheet.mergeCells('AA37:AD37');
  sheet.getCell('AA37').value = 'Referee : _____________________';
  sheet.getCell('AA37').font = { size: 9 };

  // ── Row 38: WHITE data row + Abbreviations line 2 ─────────────────────────
  sheet.mergeCells('M38:V38');
  sheet.getCell('M38').value = 'TO - Time Out           PG - Penalty Goal           EG - Extra Man Goal';
  sheet.getCell('M38').font = { size: 9 };
  sheet.mergeCells('AA38:AD38');
  sheet.getCell('AA38').value = '________________________________';
  sheet.getCell('AA38').font = { size: 9 };

  // ── Row 39: BLUE data row (blank) ─────────────────────────────────────────

  // ── Borders ───────────────────────────────────────────────────────────────
  // Timeline grid (col headers + all data rows): rows 3–34, cols K–T (11–20)
  applyBorders(sheet, 3, 11, 34, 20);
  // White team roster table: rows 18–34, cols A–J (1–10)
  applyBorders(sheet, 18, 1, 34, 10);
  // Blue team roster table: rows 18–34, cols U–AD (21–30)
  applyBorders(sheet, 18, 21, 34, 30);
  // Result table: rows 36–39, cols B–G (2–7)
  applyBorders(sheet, 36, 2, 39, 7);
  // Time Out table 1: rows 36–39, cols I–L (9–12)
  applyBorders(sheet, 36, 9, 39, 12);
  // Time Out table 2: rows 36–39, cols W–Z (23–26)
  applyBorders(sheet, 36, 23, 39, 26);

  return workbook;
};
