/**
 * CSV parsing and processing utilities
 */
/**
 * Enhanced CSV parsing that properly handles semicolon separators
 */
export function parseCSV(csvText: string, separator = ","): string[][] {
  const lines = csvText.split(/\r?\n/); // Handle both \n and \r\n
  const result: string[][] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    if (line.trim() === "") continue;

    const row: string[] = [];
    let current = "";
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i += 2;
          continue;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === separator && !inQuotes) {
        // Found separator outside quotes
        row.push(current.trim());
        current = "";
      } else {
        current += char;
      }
      i++;
    }

    // Add the last field
    row.push(current.trim());

    // Only add non-empty rows
    if (row.some((cell) => cell.trim() !== "")) {
      result.push(row);
    }
  }

  return result;
}

// Add function to detect separator
export function detectSeparator(csvText: string): string {
  // Take first few lines to detect separator
  const firstLines = csvText.split(/\r?\n/).slice(0, 5).join("\n");

  const semicolonCount = (firstLines.match(/;/g) || []).length;
  const commaCount = (firstLines.match(/,/g) || []).length;

  console.log(
    `Separator detection: semicolons=${semicolonCount}, commas=${commaCount}`,
  );

  return semicolonCount > commaCount ? ";" : ",";
}

export function convertToCSV(data: any[]): string {
  const headers = [
    "Date",
    "Category",
    "Description",
    "Reference No.",
    "QTY",
    "D- Unit",
    "C- Unit",
  ];

  const rows = [headers];

  data.forEach((row) => {
    const csvRow = [
      row.date || "",
      row.category || "",
      `"${(row.description || "").replace(/"/g, '""')}"`,
      row.referenceNo || "",
      row.qty || "",
      row.debitUnit !== null && row.debitUnit !== undefined
        ? row.debitUnit.toFixed(2)
        : "",
      row.creditUnit !== null && row.creditUnit !== undefined
        ? row.creditUnit.toFixed(2)
        : "",
    ];
    rows.push(csvRow);
  });

  return rows.map((row) => row.join(",")).join("\n");
}
