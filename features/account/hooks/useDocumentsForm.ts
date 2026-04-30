// hooks/useDocumentsForm.ts

import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import { useDocumentInformationStore } from '@/store/documents.store';
import type { Documents } from '../types/documents';
import { useFileUpload } from './useFileUpload';
import { createDocuments } from '../api/documents.mutations';
import { DocumentsSchema } from '../validations/documents.validation';

export const useDocumentsForm = ({
  initialData,
}: {
  initialData?: Documents;
}) => {
  const { user } = useAuthStore();
  const { uploadBatchDocuments } = useFileUpload();
  const { setdocumentsInfo } = useDocumentInformationStore();

  const isLocked = !!initialData;

  const [formData, setFormData] = useState<Documents>(
    initialData ?? {
      idType: 'Passport',
      idUrl: '',
      businessDocumentType: 'None',
      businessDocumentUrl: null,
    },
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🔥 DISABLE BUSINESS UPLOAD IF NONE
  const isBusinessDisabled = useMemo(
    () => formData.businessDocumentType === 'None',
    [formData.businessDocumentType],
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Documents) => {
      if (!user) throw new Error('User not authenticated');
      return createDocuments(data, user.id);
    },
    onSuccess: (savedData: Documents) => {
      queryClient.invalidateQueries({
        queryKey: ['documents'],
      });
      setdocumentsInfo(savedData);
      router.back();
    },
    onError: () => {
      Alert.alert('Error', 'Something went wrong');
    },
  });

  const handleSave = useCallback(async () => {
    const result = DocumentsSchema.safeParse(formData);

    if (isLocked) return;

    if (!result.success) {
      const formatted: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const key = err.path[0] as string;
        formatted[key] = err.message;
      });

      setErrors(formatted);
      return;
    }

    try {
      if (!user) throw new Error('User not authenticated');

      // UPLOAD FILES FIRST
      const uploads = await uploadBatchDocuments(
        [
          {
            uri: formData.idUrl,
            field: 'id_url' as const,
          },
          ...(formData.businessDocumentUrl
            ? [
                {
                  uri: formData.businessDocumentUrl,
                  field: 'business_document_url' as const,
                },
              ]
            : []),
        ],
        user.id,
      );

      // SAVE TO DATABASE
      mutation.mutate({
        ...formData,
        idUrl: uploads.id_url,
        businessDocumentUrl: uploads.business_document_url,
      });
    } catch (err: any) {
      Alert.alert('Upload Error', err.message);
    }
  }, [formData, isLocked, user, uploadBatchDocuments, mutation]);

  const pickImage = useCallback(
    async (field: 'idUrl' | 'businessDocumentUrl') => {
      if (field === 'businessDocumentUrl' && isBusinessDisabled) {
        Alert.alert('Disabled', 'No business document selected.');
        return;
      }

      const ImagePicker = await import('expo-image-picker');

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      setFormData((prev) => ({
        ...prev,
        [field]: result.assets[0].uri,
      }));
    },
    [isBusinessDisabled],
  );

  const handleChange = useCallback(
    (key: keyof Documents, value: any) => {
      if (isLocked) return;

      setFormData((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: '' }));
    },
    [isLocked],
  );

  return {
    formData,
    errors,
    handleChange,
    handleSave,
    pickImage,
    isLoading: mutation.isPending,
    isLocked,
    isBusinessDisabled,
  };
};
