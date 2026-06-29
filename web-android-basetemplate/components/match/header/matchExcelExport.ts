import * as ExcelJS from 'exceljs';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';

export const generateBlankScoreSheet = async (): Promise<void> => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Official Match Record');

    // 1. Define Border Style
    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // 2. Add Content (Simplified for brevity)
    sheet.mergeCells('A1:K1');
    sheet.getCell('A1').value = 'SENIOR STATE WATER POLO CHAMPIONSHIP 2025';
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    // Example: Applying border to a range
    // Let's create a helper to apply borders to a specific block
    const applyBorderToRange = (startRow: number, startCol: number, endRow: number, endCol: number) => {
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          sheet.getCell(r, c).border = borderStyle;
        }
      }
    };

    // 3. Formatting specific sections (Example: Team White Table)
    sheet.getRow(8).values = ['No.', 'Player', 'Major Fouls', 'Goals', '', '', ''];
    applyBorderToRange(8, 1, 22, 7); // Apply borders to rows 8-22, cols 1-7

    // 4. Generate and Export
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `Official_Match_Record_Sheet.xlsx`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, buffer.toString('base64'), {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Sharing.shareAsync(fileUri);
  } catch (error) {
    console.error("Excel Export Error:", error);
    Alert.alert("Error", "Failed to generate official scoresheet.");
  }
};