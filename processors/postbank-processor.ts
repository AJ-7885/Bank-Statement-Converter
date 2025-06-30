import type { BankConfig, StandardizedTransaction } from "../types"
import { convertDateToStandard } from "../utils/date-parser"
import { parseEuropeanNumber } from "../utils/number-parser"

export function processPostbankData(data: string[][], config: BankConfig): StandardizedTransaction[] {
  const results: StandardizedTransaction[] = []
  const errors: string[] = []

  console.log(`Processing ${data.length} rows for Postbank`)

  for (let i = 0; i < data.length; i++) {
    const row = data[i]

    if (!row || row.length === 0) {
      continue
    }

    try {
      // Debug: log the first few rows to understand structure
      if (i < 5) {
        console.log(`Row ${i + 1} (${row.length} columns):`, row)
      }

      // Ensure we have enough columns
      if (row.length < 10) {
        console.warn(`Row ${i + 1}: Insufficient columns (${row.length}), skipping`)
        continue
      }

      // Step 1: Get date from column A (index 0)
      const dateStr = row[0]?.trim() || ""
      if (!dateStr) {
        console.warn(`Row ${i + 1}: Empty date, skipping`)
        continue
      }

      const convertedDate = convertDateToStandard(dateStr, config.dateFormat)
      if (!convertedDate) {
        console.warn(`Row ${i + 1}: Date conversion failed for "${dateStr}"`)
        continue
      }

      // Step 2: Merge description columns from C to O (indices 2 to 14)
      const descriptionParts: string[] = []

      // Find the actual end of description columns by looking for amount columns
      const descriptionEndIndex = Math.min(14, row.length - 3) // Leave room for amounts

      for (let colIndex = 2; colIndex <= descriptionEndIndex; colIndex++) {
        if (colIndex >= row.length) break

        const cellValue = row[colIndex]?.trim() || ""

        // Skip empty cells and cells that look like amounts
        if (
          cellValue &&
          cellValue !== "NULL" &&
          cellValue !== "null" &&
          cellValue !== "" &&
          cellValue !== "0" &&
          cellValue !== "0,00" &&
          !cellValue.match(/^-?\d+[,.]?\d*$/)
        ) {
          descriptionParts.push(cellValue)
        }
      }

      const description = descriptionParts.join(" ").trim()

      // Step 3: Get amounts from the last columns that contain numbers
      let debitAmount: number | null = null
      let creditAmount: number | null = null

      // Look for amount columns from the end of the row
      for (let colIndex = row.length - 1; colIndex >= Math.max(2, row.length - 5); colIndex--) {
        const cellValue = row[colIndex]?.trim() || ""

        if (cellValue && cellValue !== "" && cellValue !== "0" && cellValue !== "0,00") {
          const parsedAmount = parseEuropeanNumber(cellValue)

          if (parsedAmount !== null && parsedAmount > 0) {
            if (creditAmount === null) {
              creditAmount = parsedAmount
              console.log(`Row ${i + 1}: Found credit amount in column ${colIndex}: ${cellValue} -> ${parsedAmount}`)
            } else if (debitAmount === null) {
              debitAmount = parsedAmount
              console.log(`Row ${i + 1}: Found debit amount in column ${colIndex}: ${cellValue} -> ${parsedAmount}`)
              break
            }
          }
        }
      }

      // Only add transaction if we have meaningful data
      if (convertedDate && (description || debitAmount !== null || creditAmount !== null)) {
        results.push({
          date: convertedDate,
          category: "",
          description: description,
          referenceNo: "",
          qty: "",
          debitUnit: debitAmount,
          creditUnit: creditAmount,
        })

        console.log(
          `Row ${i + 1}: Added transaction - Date: ${convertedDate}, Desc: "${description.substring(0, 50)}...", Debit: ${debitAmount}, Credit: ${creditAmount}`,
        )
      } else {
        console.warn(`Row ${i + 1}: Skipped - insufficient data`)
      }
    } catch (error) {
      const errorMsg = `Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`
      console.error(errorMsg)
      errors.push(errorMsg)
    }
  }

  // Step 4: Sort by date from oldest to newest
  results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  console.log(`Postbank processing complete: ${results.length} transactions processed`)
  if (errors.length > 0) {
    console.warn(`Postbank processing had ${errors.length} errors`)
  }

  return results
}
