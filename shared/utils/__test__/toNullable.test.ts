import { toNullable } from "../toNullable";

describe("toNullable", () => {
  it("should return null for undefined", () => {
    expect(toNullable(undefined)).toBeNull();
  });

  it("should return null for null", () => {
    expect(toNullable(null)).toBeNull();
  });

  it("should return null for empty string", () => {
    expect(toNullable("")).toBeNull();
  });

  it("should return null for whitespace string", () => {
    expect(toNullable("   ")).toBeNull();
  });

  it("should return trimmed valid string", () => {
    expect(toNullable(" hello ")).toBe("hello");
  });

  it("should return normal string", () => {
    expect(toNullable("test")).toBe("test");
  });
});
