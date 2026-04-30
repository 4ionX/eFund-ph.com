const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

const convertBelowThousand = (num: number): string => {
  let result = "";

  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }

  if (num >= 20) {
    result += tens[Math.floor(num / 10)] + " ";
    num %= 10;
  }

  if (num > 0) {
    result += ones[num] + " ";
  }

  return result.trim();
};

export const amountToWords = (amount: number | string | null | undefined): string => {
  const num = Number(amount);

  if (!Number.isFinite(num) || num <= 0) return "Zero Pesos Only";

  const parts = num.toFixed(2).split(".");
  let whole = parseInt(parts[0], 10);
  const decimal = parseInt(parts[1], 10);

  const millions = Math.floor(whole / 1_000_000);
  whole %= 1_000_000;

  const thousands = Math.floor(whole / 1000);
  const remainder = whole % 1000;

  let words = "";

  if (millions > 0) {
    words += convertBelowThousand(millions) + " Million ";
  }

  if (thousands > 0) {
    words += convertBelowThousand(thousands) + " Thousand ";
  }

  if (remainder > 0) {
    words += convertBelowThousand(remainder) + " ";
  }

  words = words.trim() + " Pesos";

  if (decimal > 0) {
    words += ` and ${convertBelowThousand(decimal)} Centavos`;
  }

  return words + " Only";
};