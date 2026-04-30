export function mapSnakeToCamel(input: any): any {
  if (Array.isArray(input)) {
    return input.map(mapSnakeToCamel);
  }

  if (input !== null && typeof input === "object") {
    return Object.entries(input).reduce((acc: any, [key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
      acc[camelKey] = mapSnakeToCamel(value); // 🔥 recursion for nested objects
      return acc;
    }, {});
  }

  return input;
}
