/**
 * Converts various date formats to YYYY-MM-DD
 * Handles European formats with single or double digits
 */
export function convertDateToStandard(dateStr: string, fromFormat: string): string {
  if (!dateStr || dateStr.trim() === "") return ""

  const cleanDate = dateStr.trim()

  try {
    let date: Date

    switch (fromFormat) {
      case "D.M.YYYY":
      case "DD.MM.YYYY":
        // Handle German format: 2.5.2025 or 02.05.2025
        const germanParts = cleanDate.split(".")
        if (germanParts.length !== 3) throw new Error("Invalid German date format")

        const [dayStr, monthStr, yearStr] = germanParts
        const day = Number.parseInt(dayStr, 10)
        const month = Number.parseInt(monthStr, 10)
        const year = Number.parseInt(yearStr, 10)

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
          throw new Error("Invalid date components")
        }

        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
          throw new Error("Date components out of range")
        }

        date = new Date(year, month - 1, day)
        break

      case "DD/MM/YYYY":
        // European slash format: 02/01/2025 = 2nd January 2025
        const [dd, mm, yyyy] = cleanDate.split("/")
        if (!dd || !mm || !yyyy) throw new Error("Invalid DD/MM/YYYY format")

        const dayNum = Number.parseInt(dd, 10)
        const monthNum = Number.parseInt(mm, 10)
        const yearNum = Number.parseInt(yyyy, 10)

        if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
          throw new Error("Invalid date numbers")
        }

        date = new Date(yearNum, monthNum - 1, dayNum)
        break

      case "MM/DD/YYYY":
        // American format: 02/01/2025 = 1st February 2025
        const [m, d, y] = cleanDate.split("/")
        if (!m || !d || !y) throw new Error("Invalid MM/DD/YYYY format")
        date = new Date(Number.parseInt(y, 10), Number.parseInt(m, 10) - 1, Number.parseInt(d, 10))
        break

      case "DD-MM-YYYY":
        // European dash format
        const [dd2, mm2, yyyy2] = cleanDate.split("-")
        if (!dd2 || !mm2 || !yyyy2) throw new Error("Invalid DD-MM-YYYY format")
        date = new Date(Number.parseInt(yyyy2, 10), Number.parseInt(mm2, 10) - 1, Number.parseInt(dd2, 10))
        break

      case "YYYY-MM-DD":
        // ISO format
        date = new Date(cleanDate)
        break

      default:
        date = new Date(cleanDate)
    }

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date object")
    }

    // Format as YYYY-MM-DD
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  } catch (error) {
    console.warn(`Date conversion failed for "${dateStr}" with format "${fromFormat}":`, error)
    return "" // Return empty string instead of original on failure
  }
}
