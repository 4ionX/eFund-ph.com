import { loginSchema } from '@/features/auth/validations/auth.validation';
import { useAuthStore } from '@/store/auth.store';
import { useState } from 'react';
import { Alert } from 'react-native';
import { sendPasswordResetEmail } from '../api/password.api';
import { signInWithEmail } from '../api/signIn.api';
import { signInWithGoogle } from '../api/google.api';

export const useLogin = () => {
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLoginWithEmail = async (email: string, password: string) => {
    setErrors({});
    const values = { email, password };

    const result = loginSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0];
        if (field !== undefined) fieldErrors[String(field)] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const user = await signInWithEmail(email, password);
      setUser(user);
    } catch (error: any) {
      setErrors({ password: error.message });
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    if (!email) {
      setErrors({ email: 'Please enter your email' });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(email);
      Alert.alert('Success', 'Password reset email sent.');
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
    showPassword,
    setShowPassword,
    loading,
    errors,
    handleLoginWithEmail,
    googleSignIn,
    forgotPassword,
  };
};
