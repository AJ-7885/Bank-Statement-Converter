import type { BankConfig, StandardizedTransaction } from "../types";
import { convertDateToStandard } from "../utils/date-parser";
import { parseEuropeanNumber } from "../utils/number-parser";

export function processAmexData(
  data: string[][],
  config: BankConfig,
): StandardizedTransaction[] {
  const results: StandardizedTransaction[] = [];
  const errors: string[] = [];
  const skipped: string[] = [];

  console.log(`\n=== PROCESSING AMERICAN EXPRESS DATA ===`);
  console.log(`Total rows to process: ${data.length}`);

  // Log first few rows to understand structure
  console.log(`First 3 rows structure:`);
  data.slice(0, 3).forEach((row, i) => {
    console.log(`Row ${i}: [${row.length} cols]`, row);
  });

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    if (!row || row.length === 0) {
      skipped.push(`Row ${i + 1}: Empty row`);
      continue;
    }

    try {
      // More lenient column check
      if (row.length < 2) {
        skipped.push(`Row ${i + 1}: Too few columns (${row.length})`);
        continue;
      }

      // Column A (index 0): Date - "Datum"
      const dateStr = row[0]?.trim() || "";
      let convertedDate = "";

      if (dateStr) {
        // For German Amex, try DD/MM/YYYY format first (most common)
        convertedDate = convertDateToStandard(dateStr, "DD/MM/YYYY");

        // If that fails, try MM/DD/YYYY
        if (!convertedDate) {
          convertedDate = convertDateToStandard(dateStr, "MM/DD/YYYY");
        }

        // If still fails, try DD.MM.YYYY (German with dots)
        if (!convertedDate) {
          convertedDate = convertDateToStandard(dateStr, "DD.MM.YYYY");
        }

        if (i < 5) {
          console.log(`Row ${i + 1}: Date "${dateStr}" -> "${convertedDate}"`);
        }
      }

      // Get description from available columns
      let description = "";

      // Try main description field (Column B - index 1)
      if (row.length > 1 && row[1]?.trim()) {
        description = row[1].trim();
      }

      // If no description in B, try other description fields
      if (!description) {
        // Try "Erscheint auf Ihrer Abrechnung als" (usually around index 6)
        if (row.length > 6 && row[6]?.trim()) {
          description = row[6].trim();
        }
        // Try combining multiple description fields
        else if (row.length > 2) {
          const descParts = [];
          for (let j = 1; j < Math.min(row.length, 8); j++) {
            const part = row[j]?.trim();
            if (
              part &&
              part !== "" &&
              !part.match(/^\d+[.,]\d+$/) &&
              !part.match(/^-?\d+[.,]\d+$/)
            ) {
              descParts.push(part);
            }
          }
          description = descParts.slice(0, 2).join(" - "); // Take first 2 non-numeric fields
        }
      }

      // Column E (index 4): Amount - "Betrag"
      let debitAmount: number | null = null;
      let creditAmount: number | null = null;

      if (row.length > 4) {
        const amountStr = row[4]?.trim() || "";

        if (
          amountStr &&
          amountStr !== "" &&
          amountStr !== "0" &&
          amountStr !== "0,00"
        ) {
          const parsedAmount = parseEuropeanNumber(amountStr);

          if (parsedAmount !== null && parsedAmount > 0) {
            // Check if original amount was negative
            const isNegative =
              amountStr.includes("-") || amountStr.startsWith("(");

            if (isNegative) {
              // Negative = money going out = Credit
              creditAmount = parsedAmount;
            } else {
              // Positive = money coming in = Debit
              debitAmount = parsedAmount;
            }

            if (i < 5) {
              console.log(
                `Row ${i + 1}: Amount "${amountStr}" -> D-Unit: ${debitAmount}, C-Unit: ${creditAmount}`,
              );
            }
          }
        }
      }

      // MUCH MORE LENIENT: Add transaction if we have ANY meaningful data
      const hasDate = convertedDate !== "";
      const hasDescription = description !== "";
      const hasAmount = debitAmount !== null || creditAmount !== null;

      if (hasDate || hasDescription || hasAmount) {
        results.push({
          date: convertedDate || "1900-01-01", // Use placeholder date if missing
          category: "",
          description: description || "No description available",
          referenceNo: "",
          qty: "",
          debitUnit: debitAmount,
          creditUnit: creditAmount,
        });

        if (i < 10) {
          console.log(
            `Row ${i + 1}: ✅ ADDED - Date: "${convertedDate}", Desc: "${description.substring(0, 30)}", D: ${debitAmount}, C: ${creditAmount}`,
          );
        }
      } else {
        skipped.push(
          `Row ${i + 1}: No meaningful data - Date: "${dateStr}", Desc: "${description}", Amount: "${row[4] || "N/A"}"`,
        );
        if (i < 10) {
          console.log(`Row ${i + 1}: ❌ SKIPPED - no meaningful data`);
        }
      }
    } catch (error) {
      const errorMsg = `Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`;
      console.error(errorMsg);
      errors.push(errorMsg);
      skipped.push(errorMsg);
    }
  }

  // Sort by date, handling placeholder dates
  results.sort((a, b) => {
    const dateA = new Date(a.date === "1900-01-01" ? "2000-01-01" : a.date);
    const dateB = new Date(b.date === "1900-01-01" ? "2000-01-01" : b.date);
    return dateA.getTime() - dateB.getTime();
  });

  console.log(`\n=== AMEX PROCESSING SUMMARY ===`);
  console.log(`Input rows: ${data.length}`);
  console.log(`Successfully processed: ${results.length}`);
  console.log(`Skipped rows: ${skipped.length}`);
  console.log(`Errors: ${errors.length}`);

  // Show first 10 skipped rows for debugging
  if (skipped.length > 0) {
    console.log(`\nFirst 10 skipped rows:`);
    skipped.slice(0, 10).forEach((skip) => console.log(`  - ${skip}`));
  }

  return results;
}
