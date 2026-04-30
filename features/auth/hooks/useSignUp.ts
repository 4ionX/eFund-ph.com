import {
  signupSchema,
  type SignupSchema,
} from '@/features/auth/validations/auth.validation';

import { useState } from 'react';

import { signUpWithEmail } from '../api/signUp.api';

export const useSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignup = async () => {
    setErrors({});

    // Prepare values
    const values: SignupSchema = { email, password, confirmPassword };
    const result = signupSchema.safeParse(values);

    // Validation failed
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
      await signUpWithEmail(email, password);
    } catch (error: any) {
      setErrors({ email: error.message });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
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
    handleSignup,
  };
};
