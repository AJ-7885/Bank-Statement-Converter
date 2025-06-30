/**
 * Parses European number formats and returns absolute values
 * Handles formats like: 1.234,56 or 1234,56 or 1234.56 or -123,45
 */
export function parseEuropeanNumber(numStr: string): number | null {
  if (!numStr || typeof numStr !== "string") return null;

  const cleaned = numStr.trim();

  // Return null for empty, zero, or placeholder values
  if (
    cleaned === "" ||
    cleaned === "0" ||
    cleaned === "0,00" ||
    cleaned === "0.00" ||
    cleaned === "-"
  ) {
    return null;
  }

  try {
    // Remove currency symbols, spaces, and other non-numeric characters except . , -
    let normalized = cleaned.replace(/[€$£\s]/g, "");

    // Handle different European number formats
    if (normalized.includes(",") && normalized.includes(".")) {
      // Format: 1.234,56 (German/European) or 1,234.56 (US)
      const lastCommaIndex = normalized.lastIndexOf(",");
      const lastDotIndex = normalized.lastIndexOf(".");

      if (lastCommaIndex > lastDotIndex) {
        // Comma is decimal separator: 1.234,56
        normalized = normalized.replace(/\./g, "").replace(",", ".");
      } else {
        // Dot is decimal separator: 1,234.56
        normalized = normalized.replace(/,/g, "");
      }
    } else if (normalized.includes(",")) {
      // Only comma: could be thousands separator or decimal
      const commaIndex = normalized.indexOf(",");
      const afterComma = normalized.substring(commaIndex + 1);

      if (afterComma.length <= 2 && /^\d+$/.test(afterComma)) {
        // Likely decimal separator: 1234,56
        normalized = normalized.replace(",", ".");
      } else {
        // Likely thousands separator: 1,234
        normalized = normalized.replace(/,/g, "");
      }
    }

    const parsed = Number.parseFloat(normalized);

    if (isNaN(parsed)) {
      console.warn(`Could not parse number: "${numStr}" -> "${normalized}"`);
      return null;
    }

    // Return absolute value (remove negative signs as requested)
    return Math.abs(parsed);
  } catch (error) {
    console.warn(`Number parsing failed for "${numStr}":`, error);
    return null;
  }
}
