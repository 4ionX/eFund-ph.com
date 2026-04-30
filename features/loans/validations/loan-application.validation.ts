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

export const LoanStatusSchema = z.enum([
  'Pending',
  'Rejected',
  'For Approval',
  'Approved',
  'Cancelled',
]);

export const DisbursementMethodSchema = z.enum(['eWallet', 'Bank']);

export const ProviderSchema = z.enum([
  // E-Wallets
  'GCash',
  'Maya',
  'GrabPay',
  'ShopeePay',
  'Lazada Wallet',

  // Digital Banks
  'Tonik',
  'UNO Digital Bank',
  'UnionDigital Bank',
  'GoTyme Bank',
  'Maya Bank',
  'SeaBank',

  // Traditional Banks
  'BDO',
  'BPI',
  'Metrobank',
  'Landbank',
  'PNB',
  'RCBC',
  'Security Bank',
  'UnionBank',
  'EastWest Bank',
  'Chinabank',
  'Maybank Philippines',
  'DBP',
  'AUB',
  'Robinsons Bank',
  'Sterling Bank of Asia',
  'Philippine Savings Bank (PSBank)',
  'City Savings Bank',
]);

/* =========================
   MAIN SCHEMA
========================= */
export const LoanApplicationSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),

  loanType: LoanTypeSchema,

  loanAmount: z.coerce
    .number({
      error: 'Loan amount is required',
    })
    .positive('Loan amount must be greater than 0'),

  disbursementMethod: DisbursementMethodSchema,

  accountName: z.string().min(2, 'Account name is required'),

  accountNumber: z
    .string()
    .min(10, 'Account number is required and must be atleast 10 characters')
    .regex(/^\d+$/, 'Account number must be numeric'),

  provider: ProviderSchema,

  status: LoanStatusSchema,

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
