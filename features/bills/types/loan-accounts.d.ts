export type BillStatus = 'Active' | 'Closed';

export type LoanType = 'Regular' | 'Special' | 'Salary' | 'Emergency';
export type LoanAccountStatus = 'Active' | 'Closed';
export type RepaymentFrequency =
  | 'Weekly'
  | 'Biweekly'
  | 'Semi-monthly'
  | 'Monthly'
  | 'Custom';

export interface LoanAccounts {
  id?: string;
  userId?: string;
  loanApplicationId?: string;

  // Core loan info
  approvedAmount: number;
  loanType: LoanType;
  repaymentFrequency: RepaymentFrequency;

  // Financial breakdown
  interest: number;
  interestRate: number;
  efficiencyRate: number;
  balance: number;
  totalPaid: number;
  netAmount: number;
  totalDeduction: number;

  serviceFee: number;
  processingFee: number;
  notarialFee: number;

  // Status
  status: LoanAccountStatus;

  // Dates (nullable in DB)
  releasedAt?: string | null;
  maturityDate?: string | null;

  // Signature (NEW)
  signatureUrl?: string | null;
  signedAt?: string | null;

  // Audit
  createdAt?: string;
  updatedAt?: string;
}
