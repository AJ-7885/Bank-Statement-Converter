import { describe, it, expect } from "vitest";
import { analyzeDateFormat } from "./analyze-amex-data";

describe("analyzeDateFormat", () => {
  it("should detect DD/MM/YYYY", () => {
    expect(analyzeDateFormat("01/07/2025")).toBe("DD/MM/YYYY or MM/DD/YYYY");
  });
  it("should detect DD.MM.YYYY", () => {
    expect(analyzeDateFormat("01.07.2025")).toBe("DD.MM.YYYY");
  });
  it("should detect YYYY-MM-DD", () => {
    expect(analyzeDateFormat("2025-07-01")).toBe("YYYY-MM-DD");
  });
  it("should detect empty", () => {
    expect(analyzeDateFormat("")).toBe("empty");
  });
  it("should detect unknown", () => {
    expect(analyzeDateFormat("07-01-2025")).toBe("unknown: 07-01-2025");
  });
});
