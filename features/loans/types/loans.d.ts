export type LoanType = 'Regular' | 'Special' | 'Salary' | 'Emergency';
export type LoanStatus =
  | 'Pending'
  | 'Rejected'
  | 'For Approval'
  | 'Approved'
  | 'Cancelled';

export type DisbursementMethod = 'eWallet' | 'Bank';
export type Provider =
  // E-Wallets
  | 'GCash'
  | 'Maya'
  | 'GrabPay'
  | 'ShopeePay'
  | 'Lazada Wallet'

  // Digital Banks
  | 'Tonik'
  | 'UNO Digital Bank'
  | 'UnionDigital Bank'
  | 'GoTyme Bank'
  | 'Maya Bank'
  | 'SeaBank'

  // Traditional Banks (PH)
  | 'BDO'
  | 'BPI'
  | 'Metrobank'
  | 'Landbank'
  | 'PNB'
  | 'RCBC'
  | 'Security Bank'
  | 'UnionBank'
  | 'EastWest Bank'
  | 'Chinabank'
  | 'Maybank Philippines'
  | 'DBP'
  | 'AUB'
  | 'Robinsons Bank'
  | 'Sterling Bank of Asia'
  | 'Philippine Savings Bank (PSBank)'
  | 'City Savings Bank';

export interface LoanApplication {
  id?: string;
  userId?: string;
  loanType: string;
  loanAmount: number;
  disbursementMethod: string;
  accountName: string;
  accountNumber: string;
  provider: string;
  status: LoanStatus;
  createdAt?: string;
  updatedAt?: string;
}
