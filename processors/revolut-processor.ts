import type { BankConfig, StandardizedTransaction } from "../types";
import { convertDateToStandard } from "../utils/date-parser";
import { parseEuropeanNumber } from "../utils/number-parser";

export function processRevolutData(
  data: string[][],
  config: BankConfig,
): StandardizedTransaction[] {
  const results: StandardizedTransaction[] = [];
  const errors: string[] = [];
  const skipped: string[] = [];

  console.log(`Processing ${data.length} rows for Revolut`);

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    if (!row || row.length === 0) {
      skipped.push(`Row ${i + 1}: Empty row`);
      continue;
    }

    try {
      console.log(`Row ${i + 1} (${row.length} columns):`, row);

      // Need at least 6 columns for Revolut format
      if (row.length < 6) {
        skipped.push(`Row ${i + 1}: Too few columns (${row.length})`);
        continue;
      }

      // Column C (index 2): Date with time - extract only date portion
      const dateTimeStr = row[2]?.trim() || "";
      if (!dateTimeStr) {
        skipped.push(`Row ${i + 1}: Empty date field`);
        continue;
      }

      // Extract date portion from datetime (remove time)
      let dateStr = dateTimeStr;
      if (dateTimeStr.includes(" ")) {
        dateStr = dateTimeStr.split(" ")[0];
      }

      const convertedDate = convertDateToStandard(dateStr, "YYYY-MM-DD");
      if (!convertedDate) {
        skipped.push(`Row ${i + 1}: Date conversion failed for "${dateStr}"`);
        continue;
      }

      // Column E (index 4): Description
      const description = row[4]?.trim() || "";

      // Column F (index 5): Amount
      const amountStr = row[5]?.trim() || "";
      let debitAmount: number | null = null;
      let creditAmount: number | null = null;

      if (amountStr) {
        const parsedAmount = parseEuropeanNumber(amountStr);

        if (parsedAmount !== null) {
          // If positive, it's a credit (money coming in)
          // If negative, it's a debit (money going out)
          if (amountStr.includes("-") || parsedAmount < 0) {
            debitAmount = Math.abs(parsedAmount);
            console.log(
              `Row ${i + 1}: Negative amount -> D-Unit: ${debitAmount}`,
            );
          } else {
            creditAmount = parsedAmount;
            console.log(
              `Row ${i + 1}: Positive amount -> C-Unit: ${creditAmount}`,
            );
          }
        }
      }

      // Add transaction if we have meaningful data
      if (
        convertedDate &&
        (description || debitAmount !== null || creditAmount !== null)
      ) {
        results.push({
          date: convertedDate,
          category: "",
          description: description,
          referenceNo: "",
          qty: "",
          debitUnit: debitAmount,
          creditUnit: creditAmount,
        });

        console.log(
          `Row ${i + 1}: ✅ Added Revolut transaction - Date: ${convertedDate}, Desc: "${description}", D-Unit: ${debitAmount}, C-Unit: ${creditAmount}`,
        );
      } else {
        skipped.push(`Row ${i + 1}: No meaningful data found`);
      }
    } catch (error) {
      const errorMsg = `Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`;
      console.error(errorMsg);
      errors.push(errorMsg);
      skipped.push(errorMsg);
    }
  }

  // Sort by date from oldest to newest
  results.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  console.log(`\n=== REVOLUT PROCESSING SUMMARY ===`);
  console.log(`Input rows: ${data.length}`);
  console.log(`Processed transactions: ${results.length}`);
  console.log(`Skipped rows: ${skipped.length}`);

  return results;
}
