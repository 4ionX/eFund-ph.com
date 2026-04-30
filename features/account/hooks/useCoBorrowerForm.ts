import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';

import { useCoBorrowerStore } from '@/store/coBorrower.store';
import { Alert } from 'react-native';
import { createCoBorrowerWithChildren } from '../api/coBorrower.mutations';
import type { CoBorrower } from '../types/co-borrower';
import type { Children } from '../types/children';
import { CoBorrowerSchema } from '../validations/coBorrower.validation';
import { ChildrenSchema } from '../validations/children.validation';

type FormErrors = Record<string, string>;

export const useCoBorrowerForm = ({
  initialData,
}: {
  initialData?: CoBorrower;
}) => {
  const { user } = useAuthStore();
  const { setCoBorrowerInfo } = useCoBorrowerStore();

  const [formData, setFormData] = useState<CoBorrower>(
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
      children: [],
    },
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const isLocked = !!initialData;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CoBorrower) => {
      if (!user) throw new Error('User not authenticated');
      return createCoBorrowerWithChildren(data, user.id);
    },
    onSuccess: (savedData: CoBorrower) => {
      queryClient.invalidateQueries({
        queryKey: ['coBorrowers'],
      });
      setCoBorrowerInfo(savedData);
      router.back();
    },
    onError: (err: any) => {
      console.log(err);
      Alert.alert('Cannot Create', 'Something went wrong', [{ text: 'OK' }]);
    },
  });

  //----------------------------------------
  // HANDLE CHANGE
  //----------------------------------------
  const handleChange = useCallback((key: keyof CoBorrower, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }, []);

  //----------------------------------------
  // CHILDREN
  //----------------------------------------
  const addChild = useCallback(() => {
    const newChild: Children = {
      firstName: '',
      middleName: '',
      lastName: '',
      presentAddress: '',
      socialMediaLink: '',
      school: '',
    };

    setFormData((prev) => ({
      ...prev,
      children: [...(prev.children || []), newChild],
    }));
  }, []);

  const updateChild = useCallback(
    (index: number, key: keyof Children, value: string) => {
      setFormData((prev) => {
        const updated = [...(prev.children || [])];
        updated[index] = { ...updated[index], [key]: value };
        return { ...prev, children: updated };
      });

      setErrors((prev) => ({
        ...prev,
        [`children.${index}.${key}`]: '',
      }));
    },
    [],
  );

  const removeChild = useCallback((index: number) => {
    setFormData((prev) => {
      const updated = [...(prev.children || [])];
      updated.splice(index, 1);
      return { ...prev, children: updated };
    });
  }, []);

  const handleSave = useCallback(() => {
    const newErrors: FormErrors = {};

    const parentResult = CoBorrowerSchema.safeParse(formData);

    if (!parentResult.success) {
      parentResult.error.issues.forEach((err) => {
        const path = err.path.join('.');
        if (path) newErrors[path] = err.message;
      });
    }

    (formData.children || []).forEach((child, index) => {
      const result = ChildrenSchema.safeParse(child);

      if (!result.success) {
        result.error.issues.forEach((err) => {
          const path = `children.${index}.${err.path.join('.')}`;
          newErrors[path] = err.message;
        });
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate(parentResult.data as CoBorrower);
  }, [formData, mutation]);

  return {
    formData,
    errors,
    showDatePicker,
    isLocked,
    setShowDatePicker,

    handleChange,

    addChild,
    updateChild,
    removeChild,

    handleSave,
    isLoading: mutation.isPending,
  };
};
