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

export const LoanAccountStatusSchema = z.enum(['Active', 'Closed']);

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

export const LoanAccountSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  loanApplicationId: z.string().uuid().optional(),

  /* =========================
     CORE
  ========================= */
  approvedAmount: z.coerce.number().positive(),
  loanType: LoanTypeSchema,
  repaymentFrequency: RepaymentFrequencySchema,

  /* =========================
     FINANCIAL
  ========================= */
  interest: z.coerce.number().min(0),
  interestRate: z.coerce.number().min(0),
  efficiencyRate: z.coerce.number().min(0),

  balance: z.coerce.number().min(0),
  totalPaid: z.coerce.number().min(0).default(0),

  netAmount: z.coerce.number().min(0),
  totalDeduction: z.coerce.number().min(0),

  serviceFee: z.coerce.number().min(0).default(0),
  processingFee: z.coerce.number().min(0).default(0),
  notarialFee: z.coerce.number().min(0).default(0),
  /* =========================
     STATUS
  ========================= */
  status: LoanAccountStatusSchema.default('Active'),

  /* =========================
     DATES (nullable sa DB)
  ========================= */
  releasedAt: z.string().datetime().nullable().optional(),
  maturityDate: z.string().datetime().nullable().optional(),

  /* =========================
     SIGNATURE (NEW)
  ========================= */
  signatureUrl: z.string().url().nullable().optional(),
  signedAt: z.string().datetime().nullable().optional(),

  /* =========================
     AUDIT
  ========================= */
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
