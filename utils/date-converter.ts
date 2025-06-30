export function convertDateFormat(dateStr: string, fromFormat: string): string {
  if (!dateStr || dateStr.trim() === "") return ""

  try {
    let date: Date

    // Remove any extra whitespace
    const cleanDateStr = dateStr.trim()

    switch (fromFormat) {
      case "DD.MM.YYYY":
      case "D.M.YYYY":
        const parts = cleanDateStr.split(".")
        if (parts.length !== 3) throw new Error("Invalid date format")

        const [dayStr, monthStr, yearStr] = parts
        const day = Number.parseInt(dayStr)
        const month = Number.parseInt(monthStr)
        const year = Number.parseInt(yearStr)

        if (!day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12) {
          throw new Error("Invalid date values")
        }

        date = new Date(year, month - 1, day)
        break
      case "MM/DD/YYYY":
        const [m, d, y] = cleanDateStr.split("/")
        if (!m || !d || !y) throw new Error("Invalid date format")
        date = new Date(Number.parseInt(y), Number.parseInt(m) - 1, Number.parseInt(d))
        break
      case "DD-MM-YYYY":
        const [dd, mm, yyyy] = cleanDateStr.split("-")
        if (!dd || !mm || !yyyy) throw new Error("Invalid date format")
        date = new Date(Number.parseInt(yyyy), Number.parseInt(mm) - 1, Number.parseInt(dd))
        break
      case "YYYY-MM-DD":
        date = new Date(cleanDateStr)
        break
      case "DD/MM/YYYY":
        const [d2, m2, y2] = cleanDateStr.split("/")
        if (!d2 || !m2 || !y2) throw new Error("Invalid date format")
        date = new Date(Number.parseInt(y2), Number.parseInt(m2) - 1, Number.parseInt(d2))
        break
      default:
        date = new Date(cleanDateStr)
    }

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date")
    }

    return date.toISOString().split("T")[0]
  } catch (error) {
    console.warn(`Failed to convert date: ${dateStr}`, error)
    return dateStr
  }
}
