import { createClient, FunctionsHttpError } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';

export const useMayaPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL as string,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string,
  );

  const initiatePayment = async (
    loanAccountId: string,
    amount: number,
    userId: string,
    paymentScheduleId: string,
    referenceType: string = 'Principal Payment',
    remarks: string,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke(
        'maya-create-checkout',
        {
          body: {
            loan_account_id: loanAccountId,
            amount,
            user_id: userId,
            loan_repayment_schedule_id: paymentScheduleId,
            reference_type: referenceType,
            remarks,
          },
        },
      );

      if (error && error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        setError(JSON.stringify(errorMessage));
        return;
      }

      if (!data?.checkout_url) {
        setError('No checkout URL returned');
        return;
      }

      setCheckoutUrl(data.checkout_url);

      // 🔥 SAFARI SAFE FIX
      if (Platform.OS === 'web') {
        window.location.href = data.checkout_url;
        return;
      }

      // 🔥 IMPORTANT: use AUTH SESSION (fixes Safari/iOS issues)
      const result = await WebBrowser.openAuthSessionAsync(
        data.checkout_url,
        'https://auth.expo.io', // fallback redirect
      );

      console.log('Browser result:', result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    checkoutUrl,
    initiatePayment,
  };
};
