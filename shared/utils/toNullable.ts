export const toNullable = (val?: string | null) => {
  const trimmed = val?.trim();
  return trimmed ? trimmed : null;
};