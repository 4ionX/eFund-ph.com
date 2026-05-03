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
  const handleSubmit = useCallback(() => {
    const provider =
      disbursementMethod === 'eWallet' ? selectedWallet : selectedBank;

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
    loanType,
    loanAmount,
    disbursementMethod,
    selectedWallet,
    selectedBank,
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
