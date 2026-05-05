import { supabaseClient } from '@/core/api/supabaseClient';
import type { LoanApplication } from '../types/loans';

export const createLoanApplication = async (
  data: LoanApplication,
  userId: string,
) => {
  const { data: result, error } = await supabaseClient
    .from('loan_applications')
    .insert([
      {
        user_id: userId,

        loan_type: data.loanType,
        loan_amount: data.loanAmount,

        disbursement_method: data.disbursementMethod,
        account_name: data.accountName,
        account_number: data.accountNumber,

        provider: data.provider,

        status: data.status ?? 'Pending',
      },
    ])
    .select()
    .single();
  console.log(error);
  if (error) throw error;

  return result;
};

export const updateLoanContract = async (
  signatureUrl: string,
  contractId: string,
) => {
  const { data, error } = await supabaseClient
    .from('loan_contracts')
    .update({
      signature_url: signatureUrl,
    })
    .eq('id', contractId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to update contract');
  }

  return data;
};
