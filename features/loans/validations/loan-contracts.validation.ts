import { z } from 'zod';

/* =========================
   ENUMS
========================= */
export const LoanTypeSchema = z.enum([
  'Regular',
  'Special',
  'Salary',
  'Emergency',
]);

export const RepaymentFrequencySchema = z.enum([
  'Weekly',
  'Biweekly',
  'Semi-monthly',
  'Monthly',
  'Custom',
]);

/* =========================
   MAIN SCHEMA
========================= */
export const LoanContractSchema = z
  .object({
    userId: z.string().uuid(),
    loanApplicationId: z.string().uuid(),

    loanAmount: z.coerce.number().positive(),
    approvedAmount: z.coerce.number().min(0),

    loanType: LoanTypeSchema,
    provider: z.string().min(1),
    disbursementMethod: z.string().min(1),

    repaymentFrequency: RepaymentFrequencySchema,

    numberOfPayments: z.coerce.number().int().min(0),

    interest: z.coerce.number().min(0),
    interestRate: z.coerce.number().min(0),

    serviceFee: z.coerce.number().min(0),
    processingFee: z.coerce.number().min(0),
    notarialFee: z.coerce.number().min(0),
    amortizationAmount: z.coerce.number().min(0),
    netProceeds: z.coerce.number().min(0),
    totalDeduction: z.coerce.number().min(0),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    releaseDate: z.string().datetime(),

    dueDates: z.array(z.string().datetime()).optional(),
    maturityDate: z.string().datetime().nullable().optional(),
  })

  .superRefine((data, ctx) => {
    const totalDeduction =
      data.interest + data.serviceFee + data.processingFee + data.notarialFee;

    if (totalDeduction > data.loanAmount) {
      ctx.addIssue({
        code: 'custom',
        path: ['totalDeduction'],
        message: 'Total deductions cannot exceed loan amount',
      });
    }

    if (
      data.loanType === 'Salary' &&
      (!data.dueDates || data.dueDates.length === 0)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['dueDates'],
        message: 'Salary loans must have due dates',
      });
    }
  });
