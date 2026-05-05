import { useAuthStore } from '@/store/auth.store';
import { usePersonalInformationStore } from '@/store/personalInformation.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import type { PersonalInformation } from '../types/personal-information';
import { createPersonalInformation } from '../api/personalInformation.mutations';
import { PersonalInformationSchema } from '../validations/personalInformation.validation';

export const usePersonalInformationForm = ({
  initialData,
}: {
  initialData?: PersonalInformation;
}) => {
  const { user } = useAuthStore();
  const { setPersonalInfo } = usePersonalInformationStore();

  const [formData, setFormData] = useState<PersonalInformation>(
    initialData ?? {
      firstName: '',
      middleName: '',
      lastName: '',
      birthDate: '',
      civilStatus: 'Single',
      lengthOfStay: '',
      presentAddress: '',
      previousAddress: '',
      primaryContactNumber: '',
      secondaryContactNumber: '',
      sourceOfIncome: '',
      socialMediaLink: '',
    },
  );
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isLocked = !!initialData;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: PersonalInformation) => {
      if (!user) throw new Error('User not authenticated');
      return createPersonalInformation(data, user.id);
    },
    onSuccess: (savedData) => {
      queryClient.invalidateQueries({
        queryKey: ['personal-information'], // ✅ FIXED
      });

      setPersonalInfo(savedData);
      router.push('/account/co-borrower');
    },
    onError: () => {
      Alert.alert('Error', 'Something went wrong');
    },
  });

  const handleChange = useCallback(
    (key: keyof PersonalInformation, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: '' }));
    },
    [],
  );

  const handleSave = useCallback(() => {
    const result = PersonalInformationSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0] as string] = err.message;
        }
      });

      setErrors(formattedErrors);
      return;
    }

    mutation.mutate(result.data as PersonalInformation);
  }, [formData, mutation]);

  return {
    formData,
    errors,
    showDatePicker,
    setShowDatePicker,
    handleChange,
    handleSave,
    isLoading: mutation.isPending,
    isLocked,
  };
};
