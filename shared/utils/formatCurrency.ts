export function formatCurrency(
  amount: number | string | null | undefined,
): string {
  if (amount === null || amount === undefined) return "₱0.00";

  const number = typeof amount === "string" ? Number(amount) : amount;

  if (!Number.isFinite(number)) return "₱0.00";

  return `₱${number.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
