/**
 * Converts various date formats to YYYY-MM-DD
 * Handles European formats with single or double digits
 */
export function convertDateToStandard(
  dateStr: string,
  fromFormat: string
): string {
  if (!dateStr || dateStr.trim() === "") return "";

  const cleanDate = dateStr.trim();

  try {
    let date: Date;

    switch (fromFormat) {
      case "D.M.YYYY":
      case "DD.MM.YYYY":
        // Handle German format: 2.5.2025 or 02.05.2025
        const germanParts = cleanDate.split(".");
        if (germanParts.length !== 3)
          throw new Error("Invalid German date format");

        const [dayStr, monthStr, yearStr] = germanParts;
        const day = Number.parseInt(dayStr, 10);
        const month = Number.parseInt(monthStr, 10);
        const year = Number.parseInt(yearStr, 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
          throw new Error("Invalid date components");
        }

        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
          throw new Error("Date components out of range");
        }

        date = new Date(year, month - 1, day);
        break;

      case "MM/DD/YYYY":
        // American format
        const [m, d, y] = cleanDate.split("/");
        date = new Date(
          Number.parseInt(y, 10),
          Number.parseInt(m, 10) - 1,
          Number.parseInt(d, 10)
        );
        break;

      case "DD-MM-YYYY":
        // European dash format
        const [dd, mm, yyyy] = cleanDate.split("-");
        date = new Date(
          Number.parseInt(yyyy, 10),
          Number.parseInt(mm, 10) - 1,
          Number.parseInt(dd, 10)
        );
        break;

      case "YYYY-MM-DD":
        // ISO format
        date = new Date(cleanDate);
        break;

      case "DD/MM/YYYY":
        // European slash format
        const [d2, m2, y2] = cleanDate.split("/");
        date = new Date(
          Number.parseInt(y2, 10),
          Number.parseInt(m2, 10) - 1,
          Number.parseInt(d2, 10)
        );
        break;

      default:
        date = new Date(cleanDate);
    }

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date object");
    }

    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn(`Date conversion failed for "${dateStr}":`, error);
    return dateStr; // Return original if conversion fails
  }
}
