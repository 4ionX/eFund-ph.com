export const calculateMayaFee = (amount: number): number => {
  const percentage = 0.035; // 3% (slightly lower than max 3.5%)
  const fixed = 10;        // fixed gateway cost
  const profit = 1;        // 🔥 your controlled profit

  const gross = (amount + fixed + profit) / (1 - percentage);
  const fee = gross - amount;

  return Number(fee.toFixed(2));
};