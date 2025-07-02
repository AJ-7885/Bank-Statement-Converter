import type { BankConfig } from "../types";
import { processPostbankData } from "../processors/postbank-processor";
import { processAmexDataFixed } from "../processors/amex-processor-fixed";
import { processRevolutData } from "../processors/revolut-processor";
import { convertDateToStandard } from "../utils/date-parser";
import { parseEuropeanNumber } from "../utils/number-parser";

// Generic processor for other banks
function genericProcessor(data: string[][], config: BankConfig) {
  const results = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    try {
      const dateStr = row[config.dateColumn] || "";
      const convertedDate = convertDateToStandard(dateStr, config.dateFormat);

      const description = config.descriptionColumns
        .map((colIndex) => row[colIndex] || "")
        .filter((text) => text.trim() !== "")
        .join(" ")
        .trim();

      const debitAmount = parseEuropeanNumber(row[config.debitColumn] || "");
      const creditAmount = parseEuropeanNumber(row[config.creditColumn] || "");

      results.push({
        date: convertedDate,
        category: "",
        description: description,
        referenceNo: "",
        qty: "",
        debitUnit: debitAmount,
        creditUnit: creditAmount,
      });
    } catch (error) {
      console.warn(`Error processing row ${i}:`, error);
    }
  }

  return results.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export const bankConfigs: Record<string, BankConfig> = {
  postbank: {
    name: "Postbank",
    dateFormat: "D.M.YYYY",
    skipRows: 8,
    removeLastRows: 1,
    dateColumn: 0,
    descriptionColumns: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], // C to O
    debitColumn: 15, // P
    creditColumn: 16, // Q
    columnsToIgnore: [1, 17], // B and R
    processor: processPostbankData,
  },
  amex: {
    name: "American Express",
    dateFormat: "DD/MM/YYYY", // German format: 02/01/2025 = 2nd January
    skipRows: 1, // Skip header row
    removeLastRows: 0,
    dateColumn: 0, // A: Datum
    descriptionColumns: [1, 6], // B: Beschreibung, G: Erscheint auf Ihrer Abrechnung als
    debitColumn: 4, // E: Betrag
    creditColumn: 4, // E: Betrag (same column, logic in processor)
    columnsToIgnore: [],
    processor: processAmexDataFixed, // Use the fixed processor
  },
  revolut: {
    name: "Revolut",
    dateFormat: "YYYY-MM-DD",
    skipRows: 1,
    removeLastRows: 0,
    dateColumn: 2, // C: Date (with time removal)
    descriptionColumns: [4], // E: Description
    debitColumn: 5, // F: Amount (processed by custom logic)
    creditColumn: 5, // F: Amount (processed by custom logic)
    columnsToIgnore: [],
    processor: processRevolutData,
  },
  ing: {
    name: "ING Bank",
    dateFormat: "DD-MM-YYYY",
    skipRows: 1,
    removeLastRows: 0,
    dateColumn: 0,
    descriptionColumns: [1, 2],
    debitColumn: 3,
    creditColumn: 4,
    columnsToIgnore: [],
    processor: genericProcessor,
  },
  n26: {
    name: "N26",
    dateFormat: "YYYY-MM-DD",
    skipRows: 1,
    removeLastRows: 0,
    dateColumn: 0,
    descriptionColumns: [1, 4],
    debitColumn: 5,
    creditColumn: 5,
    columnsToIgnore: [],
    processor: genericProcessor,
  },
};
