import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { Alert } from 'react-native';
import type { ContactReference } from '../types/contact-reference';
import { ContactReferenceSchema } from '../validations/contactReference.validation';
import { useContactReferenceStore } from '@/store/contactReference.store';
import { createContactReference } from '../api/contactReference.mutations';

// ✅ Error type (array-based)
type ContactErrors = {
  [index: number]: Partial<Record<keyof ContactReference, string>>;
};

// ✅ Always 3 slots
const EMPTY_REFERENCES: ContactReference[] = [
  { contactName: '', contactNumber: '', relationship: '' },
  { contactName: '', contactNumber: '', relationship: '' },
  { contactName: '', contactNumber: '', relationship: '' },
];

// ✅ Normalize API data
const normalizeReferences = (data?: ContactReference[]) => {
  if (!data || data.length === 0) return EMPTY_REFERENCES;

  return [
    data[0] || EMPTY_REFERENCES[0],
    data[1] || EMPTY_REFERENCES[1],
    data[2] || EMPTY_REFERENCES[2],
  ];
};

export const useContactReferenceForm = ({
  initialData,
}: {
  initialData?: ContactReference[];
}) => {
  const { user } = useAuthStore();
  const { setContactInfo } = useContactReferenceStore();

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setFormData(normalizeReferences(initialData));
    }
  }, [initialData]);

  const [formData, setFormData] = useState<ContactReference[]>(
    normalizeReferences(initialData),
  );

  const [errors, setErrors] = useState<ContactErrors>({});

  //----------------------------------------
  // MUTATION
  //----------------------------------------
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: ContactReference[]) => {
      if (!user) throw new Error('User not authenticated');
      return createContactReference(data, user.id);
    },

    onSuccess: (savedData: ContactReference[]) => {
      queryClient.invalidateQueries({
        queryKey: ['contactReferences'],
      });
      setContactInfo(savedData);
      router.push('/account/documents');
    },

    onError: (err: any) => {
      console.log(err);
      Alert.alert('Cannot Create', 'Something went wrong', [{ text: 'OK' }]);
    },
  });

  //----------------------------------------
  // CHANGE HANDLER
  //----------------------------------------
  const handleChange = useCallback(
    (index: number, key: keyof ContactReference, value: string) => {
      setFormData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [key]: value };
        return updated;
      });

      // clear specific field error
      setErrors((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          [key]: '',
        },
      }));
    },
    [],
  );

  //----------------------------------------
  // VALIDATION + SAVE
  //----------------------------------------
  const handleSave = useCallback(() => {
    let valid = true;
    const newErrors: ContactErrors = {};

    formData.forEach((contact, index) => {
      const result = ContactReferenceSchema.safeParse(contact);

      if (!result.success) {
        valid = false;

        const fieldErrors: Record<string, string> = {};

        result.error.issues.forEach((err) => {
          const path = err.path[0] as keyof ContactReference;
          fieldErrors[path] = err.message;
        });

        newErrors[index] = fieldErrors;
      }
    });

    setErrors(newErrors);

    if (valid) {
      mutation.mutate(formData);
    }
  }, [formData, mutation]);

  return {
    formData,
    errors,
    handleChange,
    handleSave,
    isLoading: mutation.isPending,
  };
};
