export const toBigFloat = (v: any) =>
  String(Number(v || 0).toFixed(2));