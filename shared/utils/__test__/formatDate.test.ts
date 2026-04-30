import { formatDate } from "../formatDate";

describe("formatDate", () => {
  // ⚠️ NULL / UNDEFINED CASES
  it("should return 'No date' for undefined", () => {
    expect(formatDate(undefined)).toBe("No date");
  });

  it("should return 'No date' for null", () => {
    expect(formatDate(null)).toBe("No date");
  });

  it("should return 'No date' for empty string", () => {
    expect(formatDate("")).toBe("No date");
  });

  // ⚠️ INVALID DATE
  it("should return 'Invalid date' for invalid string", () => {
    expect(formatDate("invalid-date")).toBe("Invalid date");
  });

  it("should return 'Invalid date' for random text", () => {
    expect(formatDate("abc123")).toBe("Invalid date");
  });

  // ✅ VALID DATE
  it("should format valid ISO date correctly", () => {
    const result = formatDate("2024-01-15");

    expect(result).toBe("Jan 15, 2024");
  });

  it("should format another valid date correctly", () => {
    const result = formatDate("2025-12-01");

    expect(result).toBe("Dec 01, 2025");
  });

  // ⚠️ EDGE CASES
  it("should handle full ISO datetime", () => {
    const result = formatDate("2024-03-10T10:00:00Z");

    expect(result).toBe("Mar 10, 2024");
  });

  it("should handle leap year date", () => {
    const result = formatDate("2024-02-29");

    expect(result).toBe("Feb 29, 2024");
  });
});