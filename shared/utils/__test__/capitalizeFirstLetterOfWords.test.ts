import { capitalizeFirstLetterOfWords } from "../capitalizeFirstLetterOfWords";

describe("capitalizeFirstLetterOfWords", () => {
  it("should capitalize each word", () => {
    const result = capitalizeFirstLetterOfWords("hello world");
    expect(result).toBe("Hello World");
  });

  it("should handle single word", () => {
    const result = capitalizeFirstLetterOfWords("john");
    expect(result).toBe("John");
  });

  it("should handle already capitalized words", () => {
    const result = capitalizeFirstLetterOfWords("Hello World");
    expect(result).toBe("Hello World");
  });
});