import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { showAlert } from '@/shared/utils/ShowAlert';
import { router } from 'expo-router';
import { updateLoanContract } from '../api/loanApplication.mutations';
import { useFileUpload } from './useFileUpload';

export const useLoanContractForm = () => {
  const { user } = useAuthStore();
  const { uploadSignatureFile } = useFileUpload();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      signatureUrl,
      contractId,
    }: {
      signatureUrl: string;
      contractId: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return updateLoanContract(signatureUrl, contractId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['loanApplications'],
      });
      queryClient.invalidateQueries({
        queryKey: ['loanContracts'],
      });
      queryClient.invalidateQueries({
        queryKey: ['loanDetails'],
      });
      router.back();
    },
    onError: () => {
      showAlert('Error', 'Something went wrong');
    },
  });

  const handleSave = useCallback(
    async (signatureBase64: string, contractId: string) => {
      console.log('Saving contract with signature:', {
        userId: user?.id,
        contractId,
        signatureBase64: signatureBase64 ? '[base64 data]' : 'No signature',
      });
      try {
        if (!user) throw new Error('User not authenticated');
        if (!signatureBase64) throw new Error('Signature is required');

        const uploadedSignatureUrl = await uploadSignatureFile(
          signatureBase64,
          user.id,
          contractId,
        );

        mutation.mutate({
          signatureUrl: uploadedSignatureUrl,
          contractId,
        });

        showAlert('Success', 'Contract signed successfully!');
      } catch (err: any) {
        console.log(err);
        showAlert('Error', err.message || 'Failed to save contract');
      }
    },
    [user, mutation, uploadSignatureFile],
  );
  return {
    handleSave,
    isPending: mutation.isPending,
  };
};
