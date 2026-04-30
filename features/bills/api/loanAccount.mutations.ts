import { supabaseClient } from '@/core/api/supabaseClient';
import type { LoanAccounts } from '../types/loan-accounts';

export const createLoanAccount = async (data: LoanAccounts, userId: string) => {
  const { data: result, error } = await supabaseClient
    .from('loan_accounts')
    .insert([
      {
        user_id: userId,
        loan_application_id: data.loanApplicationId,

        loan_amount: data.approvedAmount,
        loan_type: data.loanType,
        repayment_frequency: data.repaymentFrequency,

        interest: data.interest,
        interest_rate: data.interestRate,
        efficiency_rate: data.efficiencyRate,

        balance: data.balance,
        total_paid: data.totalPaid,
        net_amount: data.netAmount,
        total_deduction: data.totalDeduction,

        serviceFee: data.serviceFee,
        processing_fee: data.processingFee,

        status: data.status ?? 'Active',

        released_at: data.releasedAt,
        maturity_date: data.maturityDate,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return result;
};
