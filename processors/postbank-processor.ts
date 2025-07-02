import type { BankConfig, StandardizedTransaction } from "../types";
import { convertDateToStandard } from "../utils/date-parser";
import { parseEuropeanNumber } from "../utils/number-parser";

export function processPostbankData(
  data: string[][],
  config: BankConfig,
): StandardizedTransaction[] {
  const results: StandardizedTransaction[] = [];
  const errors: string[] = [];
  const skipped: string[] = [];

  console.log(`Processing ${data.length} rows for Postbank`);

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    if (!row || row.length === 0) {
      skipped.push(`Row ${i + 1}: Empty row`);
      continue;
    }

    try {
      // Debug: log all rows to understand structure
      console.log(`Row ${i + 1} (${row.length} columns):`, row);

      // Less strict column check - just need basic data
      if (row.length < 5) {
        skipped.push(`Row ${i + 1}: Too few columns (${row.length})`);
        console.warn(`Row ${i + 1}: Too few columns (${row.length}), skipping`);
        continue;
      }

      // Step 1: Get date from column A (index 0)
      const dateStr = row[0]?.trim() || "";
      if (!dateStr) {
        skipped.push(`Row ${i + 1}: Empty date field`);
        console.warn(`Row ${i + 1}: Empty date, skipping`);
        continue;
      }

      const convertedDate = convertDateToStandard(dateStr, config.dateFormat);
      if (!convertedDate) {
        skipped.push(`Row ${i + 1}: Date conversion failed for "${dateStr}"`);
        console.warn(`Row ${i + 1}: Date conversion failed for "${dateStr}"`);
        // Don't skip - try to use original date
      }

      const finalDate = convertedDate || dateStr;

      // Step 2: Merge description columns from C to O (indices 2 to 14)
      const descriptionParts: string[] = [];

      // Be more flexible with description merging
      const maxDescriptionIndex = Math.min(14, row.length - 1);

      for (let colIndex = 2; colIndex <= maxDescriptionIndex; colIndex++) {
        if (colIndex >= row.length) break;

        const cellValue = row[colIndex]?.trim() || "";

        // More lenient filtering - include more content
        if (
          cellValue &&
          cellValue !== "NULL" &&
          cellValue !== "null" &&
          cellValue !== "" &&
          cellValue !== "0" &&
          cellValue !== "0,00"
        ) {
          // Only skip if it's clearly a formatted amount
          if (!cellValue.match(/^-?\d{1,3}([.,]\d{3})*[.,]\d{2}$/)) {
            descriptionParts.push(cellValue);
          }
        }
      }

      const description = descriptionParts.join(" ").trim();

      // Step 3: Get amounts from SPECIFIC columns first
      let debitAmount: number | null = null;
      let creditAmount: number | null = null;

      // Check Column P (index 15) for D-Unit
      if (row.length > 15) {
        const debitStr = row[15]?.trim() || "";
        if (
          debitStr &&
          debitStr !== "" &&
          debitStr !== "0" &&
          debitStr !== "0,00" &&
          debitStr !== "NULL"
        ) {
          debitAmount = parseEuropeanNumber(debitStr);
          console.log(
            `Row ${i + 1}: Column P[15] (D-Unit) = "${debitStr}" -> ${debitAmount}`,
          );
        }
      }

      // Check Column Q (index 16) for C-Unit
      if (row.length > 16) {
        const creditStr = row[16]?.trim() || "";
        if (
          creditStr &&
          creditStr !== "" &&
          creditStr !== "0" &&
          creditStr !== "0,00" &&
          creditStr !== "NULL"
        ) {
          creditAmount = parseEuropeanNumber(creditStr);
          console.log(
            `Row ${i + 1}: Column Q[16] (C-Unit) = "${creditStr}" -> ${creditAmount}`,
          );
        }
      }

      // If we don't have columns P and Q, try to find amounts in the last few columns
      if (debitAmount === null && creditAmount === null && row.length > 10) {
        console.log(
          `Row ${i + 1}: Columns P/Q not found, searching last columns for amounts`,
        );

        // Look for amounts in the last few columns
        for (
          let colIndex = row.length - 1;
          colIndex >= Math.max(10, row.length - 5);
          colIndex--
        ) {
          const cellValue = row[colIndex]?.trim() || "";

          if (
            cellValue &&
            cellValue !== "" &&
            cellValue !== "0" &&
            cellValue !== "0,00"
          ) {
            const parsedAmount = parseEuropeanNumber(cellValue);

            if (parsedAmount !== null && parsedAmount > 0) {
              if (creditAmount === null) {
                creditAmount = parsedAmount;
                console.log(
                  `Row ${i + 1}: Found amount in column ${colIndex} -> C-Unit: ${parsedAmount}`,
                );
              } else if (debitAmount === null) {
                debitAmount = parsedAmount;
                console.log(
                  `Row ${i + 1}: Found amount in column ${colIndex} -> D-Unit: ${parsedAmount}`,
                );
                break;
              }
            }
          }
        }
      }

      // More lenient validation - add transaction if we have date OR description OR amounts
      if (
        finalDate ||
        description ||
        debitAmount !== null ||
        creditAmount !== null
      ) {
        results.push({
          date: finalDate,
          category: "",
          description: description,
          referenceNo: "",
          qty: "",
          debitUnit: debitAmount,
          creditUnit: creditAmount,
        });

        console.log(
          `Row ${i + 1}: ✅ Added transaction - Date: ${finalDate}, Desc: "${description.substring(0, 30)}...", D-Unit: ${debitAmount}, C-Unit: ${creditAmount}`,
        );
      } else {
        skipped.push(`Row ${i + 1}: No meaningful data found`);
        console.warn(`Row ${i + 1}: ❌ Skipped - no meaningful data`);
      }
    } catch (error) {
      const errorMsg = `Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`;
      console.error(errorMsg);
      errors.push(errorMsg);
      skipped.push(errorMsg);
    }
  }

  // Step 4: Sort by date from oldest to newest
  results.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Handle invalid dates
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;

    return dateA.getTime() - dateB.getTime();
  });

  console.log(`\n=== POSTBANK PROCESSING SUMMARY ===`);
  console.log(`Input rows: ${data.length}`);
  console.log(`Processed transactions: ${results.length}`);
  console.log(`Skipped rows: ${skipped.length}`);
  console.log(`Errors: ${errors.length}`);

  if (skipped.length > 0) {
    console.log(`\nSkipped rows details:`);
    skipped.forEach((skip) => console.log(`  - ${skip}`));
  }

  if (errors.length > 0) {
    console.log(`\nErrors:`);
    errors.forEach((error) => console.log(`  - ${error}`));
  }

  return results;
}
