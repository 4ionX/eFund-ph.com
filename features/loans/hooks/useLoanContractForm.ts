import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useFileUpload } from './useFileUpload';
import { updateLoanContract } from '../api/loanApplication.mutations';

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
      Alert.alert('Error', 'Something went wrong');
    },
  });

  const handleSave = useCallback(
    async (signatureBase64: string, contractId: string) => {
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

        Alert.alert('Contract signed successfully!');
      } catch (err: any) {
        console.log(err);
        Alert.alert('Error', err.message || 'Failed to save contract');
      }
    },
    [user, mutation, uploadSignatureFile],
  );
  return {
    handleSave,
    isPending: mutation.isPending,
  };
};
