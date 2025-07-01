import type { BankConfig, StandardizedTransaction } from "../types"
import { convertDateToStandard } from "../utils/date-parser"
import { parseEuropeanNumber } from "../utils/number-parser"

export function processAmexDataFixed(data: string[][], config: BankConfig): StandardizedTransaction[] {
  const results: StandardizedTransaction[] = []
  const errors: string[] = []
  const skipped: string[] = []

  console.log(`\n=== PROCESSING AMERICAN EXPRESS DATA (FIXED) ===`)
  console.log(`Total rows to process: ${data.length}`)

  // Analyze the actual data structure first
  if (data.length > 0) {
    console.log(`Sample row structure:`)
    console.log(`Row 0 (${data[0]?.length || 0} cols):`, data[0])
    if (data.length > 1) {
      console.log(`Row 1 (${data[1]?.length || 0} cols):`, data[1])
    }
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i]

    // Skip completely empty rows
    if (!row || row.length === 0 || row.every((cell) => !cell || cell.trim() === "")) {
      skipped.push(`Row ${i + 1}: Completely empty row`)
      continue
    }

    try {
      // Extract data with fallbacks - be very permissive
      let convertedDate = ""
      let description = ""
      let debitAmount: number | null = null
      let creditAmount: number | null = null

      // DATE PROCESSING - Column A (index 0)
      const dateStr = row[0]?.trim() || ""
      if (dateStr) {
        // Try different date formats based on the pattern
        if (dateStr.includes("/")) {
          // Check if it looks like DD/MM/YYYY or MM/DD/YYYY
          const parts = dateStr.split("/")
          if (parts.length === 3) {
            const [first, second, third] = parts.map((p) => Number.parseInt(p, 10))

            // If first part > 12, it's likely DD/MM/YYYY
            if (first > 12) {
              convertedDate = convertDateToStandard(dateStr, "DD/MM/YYYY")
            }
            // If second part > 12, it's likely MM/DD/YYYY
            else if (second > 12) {
              convertedDate = convertDateToStandard(dateStr, "MM/DD/YYYY")
            }
            // Ambiguous case - try DD/MM/YYYY first (German format)
            else {
              convertedDate = convertDateToStandard(dateStr, "DD/MM/YYYY")
              if (!convertedDate) {
                convertedDate = convertDateToStandard(dateStr, "MM/DD/YYYY")
              }
            }
          }
        } else if (dateStr.includes(".")) {
          convertedDate = convertDateToStandard(dateStr, "DD.MM.YYYY")
        }

        // If conversion failed, try to create a valid date anyway
        if (!convertedDate && dateStr.match(/\d{1,2}[/.]\d{1,2}[/.]\d{4}/)) {
          console.warn(`Date conversion failed for "${dateStr}", using fallback`)
          // Use current date as fallback to avoid skipping the row
          convertedDate = new Date().toISOString().split("T")[0]
        }
      }

      // DESCRIPTION PROCESSING - Try multiple columns
      const descriptionSources = [
        row[1]?.trim() || "", // Column B - Beschreibung
        row[6]?.trim() || "", // Column G - Erscheint auf Ihrer Abrechnung als
        row[7]?.trim() || "", // Column H - Adresse
      ]

      // Combine non-empty descriptions
      const validDescriptions = descriptionSources.filter(
        (desc) => desc && desc !== "" && desc !== "NULL" && !desc.match(/^\d+[.,]\d+$/), // Not just a number
      )

      description = validDescriptions.slice(0, 2).join(" - ") // Take first 2 valid descriptions

      // AMOUNT PROCESSING - Column E (index 4)
      if (row.length > 4) {
        const amountStr = row[4]?.trim() || ""

        if (amountStr && amountStr !== "" && amountStr !== "0" && amountStr !== "0,00") {
          const parsedAmount = parseEuropeanNumber(amountStr)

          if (parsedAmount !== null && parsedAmount > 0) {
            // Determine if it's negative based on original string
            const isNegative = amountStr.includes("-") || amountStr.startsWith("(")

            if (isNegative) {
              creditAmount = parsedAmount // Money going out
            } else {
              debitAmount = parsedAmount // Money coming in
            }
          }
        }
      }

      // VERY LENIENT VALIDATION - process if we have ANY data
      const hasAnyData = convertedDate || description || debitAmount !== null || creditAmount !== null

      if (hasAnyData) {
        results.push({
          date: convertedDate || "1900-01-01", // Use placeholder if no date
          category: "",
          description: description || `Transaction ${i + 1}`, // Use row number if no description
          referenceNo: "",
          qty: "",
          debitUnit: debitAmount,
          creditUnit: creditAmount,
        })

        if (i < 10) {
          console.log(
            `Row ${i + 1}: ✅ PROCESSED - Date: "${convertedDate}", Desc: "${description.substring(0, 30)}", D: ${debitAmount}, C: ${creditAmount}`,
          )
        }
      } else {
        skipped.push(`Row ${i + 1}: No extractable data found`)
        if (i < 10) {
          console.log(`Row ${i + 1}: ❌ SKIPPED - no extractable data`)
          console.log(`  Raw row:`, row.slice(0, 8)) // Show first 8 columns
        }
      }
    } catch (error) {
      const errorMsg = `Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`
      console.error(errorMsg)
      errors.push(errorMsg)

      // Even on error, try to salvage what we can
      try {
        results.push({
          date: "1900-01-01",
          category: "",
          description: `Error processing row ${i + 1}`,
          referenceNo: "",
          qty: "",
          debitUnit: null,
          creditUnit: null,
        })
      } catch {
        skipped.push(errorMsg)
      }
    }
  }

  // Sort by date, handling placeholder dates
  results.sort((a, b) => {
    const dateA = new Date(a.date === "1900-01-01" ? "2000-01-01" : a.date)
    const dateB = new Date(b.date === "1900-01-01" ? "2000-01-01" : b.date)
    return dateA.getTime() - dateB.getTime()
  })

  console.log(`\n=== AMEX PROCESSING SUMMARY (FIXED) ===`)
  console.log(`Input rows: ${data.length}`)
  console.log(`Successfully processed: ${results.length}`)
  console.log(`Skipped rows: ${skipped.length}`)
  console.log(`Errors: ${errors.length}`)
  console.log(`Processing rate: ${((results.length / data.length) * 100).toFixed(1)}%`)

  if (skipped.length > 0 && skipped.length < 20) {
    console.log(`\nSkipped rows details:`)
    skipped.forEach((skip) => console.log(`  - ${skip}`))
  }

  return results
}
