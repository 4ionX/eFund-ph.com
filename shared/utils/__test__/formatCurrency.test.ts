import { formatCurrency } from "../formatCurrency";

describe("formatCurrency", () => {
  // ✅ NORMAL CASES
  it("should format a number correctly", () => {
    expect(formatCurrency(1000)).toBe("₱1,000.00");
  });

  it("should format decimal numbers correctly", () => {
    expect(formatCurrency(1234.5)).toBe("₱1,234.50");
  });

  it("should format large numbers", () => {
    expect(formatCurrency(1000000)).toBe("₱1,000,000.00");
  });

  // ✅ STRING INPUT
  it("should handle numeric string", () => {
    expect(formatCurrency("2500")).toBe("₱2,500.00");
  });

  it("should handle decimal string", () => {
    expect(formatCurrency("1234.56")).toBe("₱1,234.56");
  });

  // ⚠️ NULL / UNDEFINED
  it("should return default for null", () => {
    expect(formatCurrency(null)).toBe("₱0.00");
  });

  it("should return default for undefined", () => {
    expect(formatCurrency(undefined)).toBe("₱0.00");
  });

  // ⚠️ INVALID INPUT
  it("should return default for non-numeric string", () => {
    expect(formatCurrency("abc")).toBe("₱0.00");
  });

  it("should return default for NaN", () => {
    expect(formatCurrency(NaN)).toBe("₱0.00");
  });

  it("should return default for Infinity", () => {
    expect(formatCurrency(Infinity)).toBe("₱0.00");
  });

  // ⚠️ EDGE CASES
  it("should handle zero", () => {
    expect(formatCurrency(0)).toBe("₱0.00");
  });

  it("should handle negative numbers", () => {
    expect(formatCurrency(-1500)).toBe("₱-1,500.00");
  });
});
