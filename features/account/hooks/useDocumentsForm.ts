// hooks/useDocumentsForm.ts

import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { useDocumentInformationStore } from '@/store/documents.store';
import { createDocuments } from '../api/documents.mutations';
import type { Documents } from '../types/documents';
import { DocumentsSchema } from '../validations/documents.validation';
import { useFileUpload } from './useFileUpload';

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

  // =========================
  // DISABLE BUSINESS
  // =========================
  const isBusinessDisabled = useMemo(
    () => formData.businessDocumentType === 'None',
    [formData.businessDocumentType],
  );

  const queryClient = useQueryClient();

  // =========================
  // SAVE
  // =========================
  const mutation = useMutation({
    mutationFn: (data: Documents) => {
      if (!user) throw new Error('User not authenticated');
      return createDocuments(data, user.id);
    },
    onSuccess: (savedData: Documents) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setdocumentsInfo(savedData);

      // ✅ RESET AFTER SAVE (IMPORTANT FIX)
      setFormData({
        idType: 'Passport',
        idUrl: '',
        businessDocumentType: 'None',
        businessDocumentUrl: null,
      });

      setErrors({});

      router.back();
    },
    onError: () => {
      Alert.alert('Error', 'Something went wrong');
    },
  });

  // =========================
  // HANDLE SAVE
  // =========================
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

      // =========================
      // BUILD UPLOAD LIST (FIXED)
      // =========================
      const filesToUpload: any[] = [];

      // ID is REQUIRED
      if (formData.idUrl) {
        filesToUpload.push({
          uri: formData.idUrl,
          field: 'id_url' as const,
        });
      }

      // BUSINESS is OPTIONAL
      if (
        formData.businessDocumentType !== 'None' &&
        formData.businessDocumentUrl
      ) {
        filesToUpload.push({
          uri: formData.businessDocumentUrl,
          field: 'business_document_url' as const,
        });
      }

      // =========================
      // UPLOAD ONLY IF MAY FILES
      // =========================
      let uploads: Record<'id_url' | 'business_document_url', string | null> = {
        id_url: formData.idUrl || null,
        business_document_url: formData.businessDocumentUrl || null,
      };

      if (filesToUpload.length > 0) {
        uploads = await uploadBatchDocuments(filesToUpload, user.id);
      }

      // =========================
      // SAVE TO DB
      // =========================
      mutation.mutate({
        ...formData,
        idUrl: uploads.id_url || '',
        businessDocumentUrl: uploads.business_document_url || null,
      });
    } catch (err: any) {
      Alert.alert('Upload Error', err.message);
    }
  }, [formData, isLocked, mutation, uploadBatchDocuments, user]);

  // =========================
  // PICK IMAGE (FIXED FOR MOBILE + WEB)
  // =========================
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        base64: false,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset) return;

      let uri = asset.uri;

      // 🔥 SAFARI FIX: convert blob to stable object URL
      if (uri.startsWith('blob:')) {
        const response = await fetch(uri);
        const blob = await response.blob();
        uri = URL.createObjectURL(blob);
      }

      setFormData((prev) => ({
        ...prev,
        [field]: uri,
      }));
    },
    [isBusinessDisabled],
  );
  // =========================
  // CHANGE HANDLER
  // =========================
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
