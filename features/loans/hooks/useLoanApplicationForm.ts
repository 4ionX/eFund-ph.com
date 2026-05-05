import { useCallback, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { useAuthStore } from '@/store/auth.store';
import { createLoanApplication } from '../api/loanApplication.mutations';

import { showAlert } from '@/shared/utils/ShowAlert';
import type {
  DisbursementMethod,
  LoanApplication,
  LoanType,
  Provider,
} from '../types/loans';
import { LoanApplicationSchema } from '../validations/loan-application.validation';
import { supabaseClient } from '@/core/api/supabaseClient';

export const useLoanApplicationForm = () => {
  // ======================
  // STATE
  // ======================

  const [loanType, setLoanType] = useState<LoanType>('Regular');
  const [loanAmount, setLoanAmount] = useState('');

  const [disbursementMethod, setDisbursementMethod] =
    useState<DisbursementMethod>('eWallet');

  const [selectedWallet, setSelectedWallet] = useState<Provider | ''>('GCash');
  const [selectedBank, setSelectedBank] = useState<Provider | ''>('BDO');

  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ======================
  // GLOBAL
  // ======================
  const { user } = useAuthStore();

  const checkForReleaseLoan = async (userId: string) => {
    const { data, error } = await supabaseClient
      .from('loan_contracts')
      .select('id, status')
      .eq('user_id', userId)
      .eq('status', 'For Release')
      .limit(1);

    if (error) {
      console.log('❌ checkForReleaseLoan error:', error.message);
      return false; // fail-safe: don't block user if API fails
    }

    return (data?.length ?? 0) > 0;
  };

  // ======================
  // MUTATION
  // ======================
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: LoanApplication) => {
      if (!user) throw new Error('User not authenticated');
      return createLoanApplication(data, user.id);
    },

    onSuccess: () => {
      showAlert('Success', 'Successfully created your loan application');
      queryClient.invalidateQueries({
        queryKey: ['loanApplications'],
      });
      resetForm();
      router.back();
    },

    onError: () => {
      showAlert('Error', 'Failed to create loan application');
    },
  });

  // ======================
  // RESET
  // ======================
  const resetForm = useCallback(() => {
    setLoanType('Emergency');
    setLoanAmount('');
    setDisbursementMethod('eWallet');
    setSelectedWallet('');
    setSelectedBank('');
    setAccountName('');
    setAccountNumber('');
    setErrors({});
  }, []);

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = useCallback(async () => {
    const provider =
      disbursementMethod === 'eWallet' ? selectedWallet : selectedBank;

    if (!user) {
      showAlert(
        'Error',
        'User not authenticated, Please check our internet connection and try again.',
      );
      return;
    }

    const hasForRelease = await checkForReleaseLoan(user.id);

    if (hasForRelease) {
      showAlert(
        'Blocked',
        'You already have a loan for release. Please wait for it to be processed.',
      );
      return;
    }

    // ❌ VALIDATION GUARD
    if (!provider) {
      setErrors({ provider: 'Please select provider' });
      return;
    }

    const payload = {
      loanType,
      loanAmount,
      disbursementMethod,
      provider,
      accountName,
      accountNumber: accountNumber, // keep string (sa backend na mag validate)
      status: 'Pending',
    };

    const result = LoanApplicationSchema.safeParse(payload);

    if (!result.success) {
      const formatted: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          formatted[err.path[0] as string] = err.message;
        }
      });

      setErrors(formatted);
      return;
    }

    setErrors({});

    mutation.mutate(result.data as LoanApplication);
  }, [
    disbursementMethod,
    selectedWallet,
    selectedBank,
    user,
    loanType,
    loanAmount,
    accountName,
    accountNumber,
    mutation,
  ]);

  return {
    // state
    loanType,
    loanAmount,
    disbursementMethod,
    selectedWallet,
    selectedBank,
    accountName,
    accountNumber,
    errors,

    // setters
    setLoanType,
    setLoanAmount,
    setDisbursementMethod,
    setSelectedWallet,
    setSelectedBank,
    setAccountName,
    setAccountNumber,

    // actions
    handleSubmit,
    resetForm,

    isLoading: mutation.isPending,
  };
};
