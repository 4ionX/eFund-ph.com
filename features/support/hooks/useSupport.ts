import { Linking } from 'react-native';

import { useCallback } from 'react';

const useSupport = () => {
  const handleCall = useCallback((phoneNumber: string | undefined) => {
    if (phoneNumber) {
      const url = `tel:${phoneNumber}`;
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            return console.log(`Cannot open URL: ${url}`);
          }
        })
        .catch((error) => console.log('Error:', error));
    }
  }, []);

  const openMessenger = useCallback(async () => {
    const username = 'jeyvee.alibuyog';

    const appUrl = `fb://profile/${username}`; // try app
    const webUrl = `https://www.facebook.com/${username}`; // fallback

    try {
      const supported = await Linking.canOpenURL(appUrl);

      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.log('Error opening Facebook:', error);
      await Linking.openURL(webUrl);
    }
  }, []);

  return { handleCall, openMessenger };
};

export default useSupport;
