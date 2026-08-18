import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { showAlert } from '@/shared/utils/ShowAlert';
import { router } from 'expo-router';
import {
  updateLoanContract,
  updateCoMakerSignature,
} from '../api/loanApplication.mutations';
import { useFileUpload } from './useFileUpload';

export const useLoanContractForm = () => {
  const { user } = useAuthStore();
  const { uploadSignatureFile } = useFileUpload();
  const queryClient = useQueryClient();

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['loanApplications'],
    });
    queryClient.invalidateQueries({
      queryKey: ['loanContracts'],
    });
    queryClient.invalidateQueries({
      queryKey: ['loanDetails'],
    });
  }, [queryClient]);

  const borrowerMutation = useMutation({
    mutationFn: async ({
      signatureUrl,
      contractId,
    }: {
      signatureUrl: string;
      contractId: string;
      hasCoMaker: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return updateLoanContract(signatureUrl, contractId);
    },
    onSuccess: (_data, variables) => {
      invalidate();
      if (!variables.hasCoMaker) {
        router.back();
      }
    },
    onError: () => {
      showAlert('Error', 'Something went wrong');
    },
  });

  const coMakerMutation = useMutation({
    mutationFn: async ({
      signatureUrl,
      contractId,
    }: {
      signatureUrl: string;
      contractId: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return updateCoMakerSignature(signatureUrl, contractId);
    },
    onSuccess: () => {
      invalidate();
      router.back();
    },
    onError: () => {
      showAlert('Error', 'Something went wrong');
    },
  });

  const handleSave = useCallback(
    async (
      signatureBase64: string,
      contractId: string,
      hasCoMaker: boolean,
    ) => {
      try {
        if (!user) throw new Error('User not authenticated');
        if (!signatureBase64) throw new Error('Signature is required');

        const uploadedSignatureUrl = await uploadSignatureFile(
          signatureBase64,
          user.id,
          contractId,
          'borrower',
        );

        borrowerMutation.mutate({
          signatureUrl: uploadedSignatureUrl,
          contractId,
          hasCoMaker,
        });

        showAlert('Success', 'Contract signed successfully!');
      } catch (err: any) {
        console.log(err);
        showAlert('Error', err.message || 'Failed to save contract');
      }
    },
    [user, borrowerMutation, uploadSignatureFile],
  );

  const handleSaveCoMaker = useCallback(
    async (signatureBase64: string, contractId: string) => {
      try {
        if (!user) throw new Error('User not authenticated');
        if (!signatureBase64) throw new Error('Signature is required');

        const uploadedSignatureUrl = await uploadSignatureFile(
          signatureBase64,
          user.id,
          contractId,
          'coMaker',
        );

        coMakerMutation.mutate({
          signatureUrl: uploadedSignatureUrl,
          contractId,
        });

        showAlert('Success', 'Contract signed successfully!');
      } catch (err: any) {
        console.log(err);
        showAlert('Error', err.message || 'Failed to save contract');
      }
    },
    [user, coMakerMutation, uploadSignatureFile],
  );

  return {
    handleSave,
    handleSaveCoMaker,
    isPending: borrowerMutation.isPending || coMakerMutation.isPending,
  };
};
