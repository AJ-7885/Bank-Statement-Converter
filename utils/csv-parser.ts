export function parseCSV(text: string): string[][] {
  const lines = text.split("\n");
  const result: string[][] = [];

  for (const line of lines) {
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
      } else if (char === "," && !inQuotes) {
        row.push(current.trim());
        current = "";
      } else {
        current += char;
      }
      i++;
    }

    row.push(current.trim());
    result.push(row);
  }

  return result;
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

  const csvRows = [headers];

  data.forEach((row) => {
    const csvRow = [
      row.date,
      row.category || "",
      `"${(row.description || "").replace(/"/g, '""')}"`,
      row.referenceNo || "",
      row.qty || "",
      row.debitUnit?.toString() || "",
      row.creditUnit?.toString() || "",
    ];
    csvRows.push(csvRow);
  });

  return csvRows.map((row) => row.join(",")).join("\n");
}
