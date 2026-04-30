import { ImagesPath } from '@/shared/constants/images';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

const useSplash = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const cacheResources = async () => {
          const imageAssets = [
            ImagesPath.splash,
            ImagesPath.logo,
            ImagesPath.step_1,
            ImagesPath.step_2,
            ImagesPath.step_3,
            ImagesPath.step_4,
          ];
          const cacheImage = imageAssets.map((image) => {
            return Asset.fromModule(image).downloadAsync();
          });

          await Promise.all(cacheImage);
        };

        await cacheResources();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);
  return { appIsReady, setAppIsReady };
};

export default useSplash;
