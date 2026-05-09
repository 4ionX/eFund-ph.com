import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from '@/features/auth/validations/auth.validation';
import { useState } from 'react';
import { updatePassword } from '../api/password.api';
import { showAlert } from '@/shared/utils/ShowAlert';

export const useResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleResetPassword = async () => {
    setErrors({});

    // validation
    const values: ResetPasswordSchema = { password, confirmPassword };
    const result = resetPasswordSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0];
        if (field) fieldErrors[String(field)] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);

      showAlert('Success', 'Your password has been updated successfully!');

      // optional redirect after success
      // router.replace('/auth/login');
    } catch (error: any) {
      setErrors({
        password: error.message || 'Failed to update password',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    errors,
    handleResetPassword,
  };
};
