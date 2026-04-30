import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

const useLoadFonts = () => {
  const [loaded, error] = useFonts({
    regular: Inter_400Regular,
    medium: Inter_500Medium,
    semiBold: Inter_600SemiBold,
    bold: Inter_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return loaded;
};

export default useLoadFonts;
