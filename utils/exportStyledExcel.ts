import ExcelJS from 'exceljs';

type ExportValue = string | number | boolean | Date | null | undefined;

export const exportStyledExcel = async (
  filename: string,
  sheetName: string,
  headers: string[],
  rows: ExportValue[][],
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'MentorMind';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 1 }],
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
  });

  worksheet.addRow(headers);
  rows.forEach((row) => worksheet.addRow(row));
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: Math.max(1, rows.length + 1), column: headers.length },
  };

  const header = worksheet.getRow(1);
  header.height = 24;
  header.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.eachCell((cell, columnNumber) => {
        if (rowNumber % 2 === 0) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F6FA' } };
        }
        const heading = headers[columnNumber - 1]?.toLocaleLowerCase() ?? '';
        if (typeof cell.value === 'number') {
          if (heading.includes('progreso')) cell.numFmt = '0.0';
          else if (/(nota|puntu|puntaje|score)/.test(heading)) cell.numFmt = '0.00';
        }
        cell.alignment = { vertical: 'middle', wrapText: true };
      });
    }
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD7E0E8' } },
        left: { style: 'thin', color: { argb: 'FFD7E0E8' } },
        bottom: { style: 'thin', color: { argb: 'FFD7E0E8' } },
        right: { style: 'thin', color: { argb: 'FFD7E0E8' } },
      };
    });
  });

  worksheet.columns.forEach((column, index) => {
    const lengths = [headers[index].length, ...rows.map((row) => String(row[index] ?? '').length)];
    column.width = Math.min(42, Math.max(14, Math.max(...lengths) + 2));
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
