import { Platform } from 'react-native';
import { supabaseClient } from '@/core/api/supabaseClient';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export const useFileUpload = () => {
  const compressImage = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1280 } }],
      {
        compress: 0.6,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    return result.uri;
  };

  const uploadSignatureFile = async (
    uriOrBase64: string,
    userId: string,
    loanContractId: string,
  ) => {
    const filePath = `${userId}/${loanContractId}.jpg`;

    let base64: string;

    // 🔥 WEB CASE (IMPORTANT FIX)
    if (Platform.OS === 'web') {
      // already base64 from toDataURL()
      base64 = uriOrBase64;
    } else {
      const compressedUri = await compressImage(uriOrBase64);

      base64 = await FileSystem.readAsStringAsync(compressedUri, {
        encoding: 'base64',
      });
    }

    const fileBuffer = decode(base64);

    const { error } = await supabaseClient.storage
      .from('signatures')
      .upload(filePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw new Error(error.message);

    return filePath;
  };

  const getSignedUrl = async (filePath: string) => {
    const { data, error } = await supabaseClient.storage
      .from('signatures')
      .createSignedUrl(filePath, 60 * 10);

    if (error) throw new Error(error.message);

    return data.signedUrl;
  };

  return {
    uploadSignatureFile,
    getSignedUrl,
  };
};
